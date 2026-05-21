package com.italianrestaurant.backend.dto;

import com.italianrestaurant.backend.entity.Reservation;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ReservationDTO {
    private Long id;

    @NotBlank
    private String customerName;

    @NotBlank
    @Email
    private String email;

    private String phone;

    @NotNull
    @FutureOrPresent
    private LocalDate reservationDate;

    @NotNull
    private LocalTime reservationTime;

    @NotNull
    @Min(1)
    @Max(20)
    private Integer partySize;

    private Reservation.Status status;
    private String specialRequests;
}