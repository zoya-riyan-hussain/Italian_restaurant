package com.italianrestaurant.backend.service;

import com.italianrestaurant.backend.dto.MenuItemDTO;
import com.italianrestaurant.backend.entity.MenuItem;
import com.italianrestaurant.backend.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    public List<MenuItem> getAllItems() {
        return menuItemRepository.findAll();
    }

    public List<MenuItem> getItemsByCategory(MenuItem.Category category) {
        return menuItemRepository.findByCategory(category);
    }

    public List<MenuItem> getAvailableItems() {
        return menuItemRepository.findByAvailableTrue();
    }

    public MenuItem getItemById(Long id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
    }

    public MenuItem createItem(MenuItemDTO dto) {
        MenuItem item = new MenuItem();
        item.setName(dto.getName());
        item.setDescription(dto.getDescription());
        item.setPrice(dto.getPrice());
        item.setCategory(dto.getCategory());
        item.setImageUrl(dto.getImageUrl());
        item.setAvailable(dto.getAvailable() != null ? dto.getAvailable() : true);
        return menuItemRepository.save(item);
    }

    public MenuItem updateItem(Long id, MenuItemDTO dto) {
        MenuItem item = getItemById(id);
        item.setName(dto.getName());
        item.setDescription(dto.getDescription());
        item.setPrice(dto.getPrice());
        item.setCategory(dto.getCategory());
        item.setImageUrl(dto.getImageUrl());
        item.setAvailable(dto.getAvailable());
        return menuItemRepository.save(item);
    }

    public void deleteItem(Long id) {
        menuItemRepository.deleteById(id);
    }
}
