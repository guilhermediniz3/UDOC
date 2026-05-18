package com.system.UDoc.service;

import com.system.UDoc.dto.CardDTO;
import com.system.UDoc.entity.Card;
import com.system.UDoc.exception.ResourceNotFoundException;
import com.system.UDoc.repository.CardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CardService {

    private final CardRepository cardRepository;

    public CardService(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    @Transactional
    public CardDTO createCard(CardDTO cardDTO) {
        Card card = new Card();
        card.setTitle(cardDTO.getTitle());
        card.setDescription(cardDTO.getDescription());
        card.setIcon(cardDTO.getIcon());
        card.setSlug(cardDTO.getSlug());
        card.setContent(cardDTO.getContent());

        Card savedCard = cardRepository.save(card);
        return new CardDTO(savedCard);
    }

    @Transactional(readOnly = true)
    public List<CardDTO> getAllCards() {
        return cardRepository.findAll()
                .stream()
                .map(CardDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CardDTO getCardById(Long id) {
        Card card = cardRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Card not found with id " + id));

        return new CardDTO(card);
    }

    @Transactional
    public CardDTO updateCard(Long id, CardDTO cardDTO) {
        Card card = cardRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Card not found with id " + id));

        card.setTitle(cardDTO.getTitle());
        card.setDescription(cardDTO.getDescription());
        card.setIcon(cardDTO.getIcon());
        card.setSlug(cardDTO.getSlug());
        card.setContent(cardDTO.getContent());

        Card savedCard = cardRepository.save(card);
        return new CardDTO(savedCard);
    }

    @Transactional
    public void deleteCard(Long id) {
        if (!cardRepository.existsById(id)) {
            throw new ResourceNotFoundException("Card not found with id " + id);
        }

        cardRepository.deleteById(id);
    }
}