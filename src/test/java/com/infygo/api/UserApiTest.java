package com.infygo.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasItems;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.HashMap;
import java.util.Map;

import com.infygo.entity.UserDetails;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

class UserApiTest extends AbstractIntegrationTest {

    private Map<String, Object> registration(String userId, String email, String password) {
        Map<String, Object> body = new HashMap<>();
        body.put("userId", userId);
        body.put("name", "Asha Kumar");
        body.put("city", "Chennai");
        body.put("email", email);
        body.put("phone", "+919876543210");
        body.put("password", password);
        return body;
    }

    private ResultActions postJson(String path, Object body) throws Exception {
        return mockMvc.perform(post(path).contentType(MediaType.APPLICATION_JSON).content(json(body)));
    }

    @Test
    void validRegistrationIsSavedWithHashedPassword() throws Exception {
        postJson("/infygo/register", registration("Asha01", "Asha@Example.com", VALID_PASSWORD))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userId").value("asha01"))
                .andExpect(jsonPath("$.email").value("asha@example.com"))
                .andExpect(jsonPath("$.password").doesNotExist());

        UserDetails saved = userRepository.findById("asha01").orElseThrow();
        assertThat(saved.getPassword()).isNotEqualTo(VALID_PASSWORD).startsWith("$2");
        assertThat(passwordEncoder.matches(VALID_PASSWORD, saved.getPassword())).isTrue();
    }

    @Test
    void passwordWithoutDigitIsAccepted() throws Exception {
        // The PS requires upper, lower and special characters, not a digit.
        postJson("/infygo/register", registration("ravi02", "ravi@example.com", "NoDigits#Here"))
                .andExpect(status().isCreated());
    }

    @Test
    void missingFieldsAreRejected() throws Exception {
        postJson("/infygo/register", Map.of())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"))
                .andExpect(jsonPath("$.fieldErrors[*].field",
                        hasItems("userId", "name", "city", "email", "phone", "password")));
        assertThat(userRepository.count()).isZero();
    }

    @Test
    void invalidEmailIsRejected() throws Exception {
        postJson("/infygo/register", registration("asha01", "asha.example.com", VALID_PASSWORD))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors[*].field", hasItem("email")));
    }

    @Test
    void invalidPhoneIsRejected() throws Exception {
        Map<String, Object> body = registration("asha01", "asha@example.com", VALID_PASSWORD);
        body.put("phone", "98765-abc");
        postJson("/infygo/register", body)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors[*].field", hasItem("phone")));
    }

    @ParameterizedTest(name = "{0} -> {1}")
    @CsvSource({
            "Ab@cdefg, at least 9 characters",
            "abcdefgh@1, uppercase",
            "ABCDEFGH@1, lowercase",
            "Abcdefghij1, special character"})
    void weakPasswordsAreRejected(String password, String expectedMessage) throws Exception {
        postJson("/infygo/register", registration("asha01", "asha@example.com", password))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors[?(@.field == 'password')].message",
                        hasItem(containsString(expectedMessage))));
        assertThat(userRepository.count()).isZero();
    }

    @Test
    void duplicateEmailIsRejected() throws Exception {
        saveUser("asha01", "asha@example.com");
        postJson("/infygo/register", registration("asha02", "ASHA@example.com", VALID_PASSWORD))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("DUPLICATE_RESOURCE"));
        assertThat(userRepository.count()).isEqualTo(1);
    }

    @Test
    void duplicateUserIdIsRejected() throws Exception {
        saveUser("asha01", "asha@example.com");
        postJson("/infygo/register", registration("ASHA01", "other@example.com", VALID_PASSWORD))
                .andExpect(status().isConflict());
    }

    @Test
    void validLoginSucceedsWithoutLeakingTheHash() throws Exception {
        saveUser("asha01", "asha@example.com");
        String body = postJson("/infygo/login", Map.of("userId", "asha01", "password", VALID_PASSWORD))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value("asha01"))
                .andReturn().getResponse().getContentAsString();
        assertThat(body).doesNotContain("$2").doesNotContainIgnoringCase("password");
    }

    @Test
    void wrongPasswordAndUnknownUserGiveTheSameResponse() throws Exception {
        saveUser("asha01", "asha@example.com");
        String wrong = postJson("/infygo/login", Map.of("userId", "asha01", "password", "Wrong@Pass1"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("INVALID_CREDENTIALS"))
                .andReturn().getResponse().getContentAsString();
        String unknown = postJson("/infygo/login", Map.of("userId", "nobody", "password", "Wrong@Pass1"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("INVALID_CREDENTIALS"))
                .andReturn().getResponse().getContentAsString();
        String wrongMessage = objectMapper.readTree(wrong).get("message").asText();
        assertThat(objectMapper.readTree(unknown).get("message").asText()).isEqualTo(wrongMessage);
        assertThat(wrong).doesNotContain("Exception").doesNotContain("$2");
    }

    @Test
    void loginFieldsAreMandatory() throws Exception {
        postJson("/infygo/login", Map.of("userId", ""))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors[*].field", hasItems("userId", "password")));
    }

    @Test
    void malformedJsonIsRejected() throws Exception {
        mockMvc.perform(post("/infygo/login").contentType(MediaType.APPLICATION_JSON).content("{not json"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("MALFORMED_REQUEST"));
    }
}
