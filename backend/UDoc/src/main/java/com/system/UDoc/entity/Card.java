package com.system.UDoc.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "card")
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String icon;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private Boolean active = true;

    public Card() {
    }

    public Card(
            Long id,
            String title,
            String description,
            String icon,
            String content,
            Boolean active
    ) {

        this.id = id;
        this.title = title;
        this.description = description;
        this.icon = icon;
        this.content = content;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }


    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}