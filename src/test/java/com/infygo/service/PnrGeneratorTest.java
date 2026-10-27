package com.infygo.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.infygo.config.InfyGoProperties;

import org.junit.jupiter.api.Test;

class PnrGeneratorTest {

    private static InfyGoProperties properties(int min, int max) {
        return new InfyGoProperties("Asia/Kolkata", new InfyGoProperties.Pnr(min, max, 10),
                new InfyGoProperties.Seed(false));
    }

    @Test
    void candidatesStayWithinTheConfiguredSevenDigitRange() {
        PnrGenerator generator = new PnrGenerator(properties(1_000_000, 9_999_999));
        for (int i = 0; i < 10_000; i++) {
            assertThat(generator.nextCandidate()).isBetween(1_000_000, 9_999_999);
        }
    }

    @Test
    void invalidRangeIsRejectedAtStartup() {
        assertThatThrownBy(() -> new PnrGenerator(properties(10, 5))).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void cardMaskingKeepsOnlyTheLastFourCharacters() {
        assertThat(PaymentService.mask("TESTCARD00003456")).isEqualTo("XXXXXXXXXXXX3456");
    }
}
