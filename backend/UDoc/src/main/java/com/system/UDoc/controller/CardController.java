package com.system.UDoc.controller;

import com.system.UDoc.dto.CardDTO;
import com.system.UDoc.service.CardService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cards")
@CrossOrigin(origins = "http://localhost:5173")
public class CardController {

    private final CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @PostMapping
    public ResponseEntity<CardDTO> createCard(@Valid @RequestBody CardDTO cardDTO) {
        CardDTO createdCard = cardService.createCard(cardDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdCard);
    }

    @GetMapping
    public ResponseEntity<List<CardDTO>> getAllCards() {
        List<CardDTO> cards = cardService.getAllCards();
        return ResponseEntity.ok(cards);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CardDTO> getCardById(@PathVariable Long id) {
        CardDTO card = cardService.getCardById(id);
        return ResponseEntity.ok(card);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CardDTO> updateCard(
            @PathVariable Long id,
            @Valid @RequestBody CardDTO cardDTO) {

        CardDTO updatedCard = cardService.updateCard(id, cardDTO);
        return ResponseEntity.ok(updatedCard);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCard(@PathVariable Long id) {
        cardService.deleteCard(id);
        return ResponseEntity.noContent().build();
    }
}