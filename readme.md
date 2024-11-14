# Autodoc Web Scraping Data Documentation

This documentation provides an overview of the JSON data structure used for the Autodoc web scraping task.

## File Structure

The data is organized into two files:

- **categories.json**: Contains basic information for the 38 main product categories.
- **data.json**: Contains detailed data for each category, including nested subcategories and individual items.

### `categories.json`

This file contains the high-level categories of car parts, each represented with an ID, name, and image URL. Some categories also include a link to the Autodoc website.

#### Structure

```json
{
  "categories": [
    {
      "id": "string",
      "name": "string",
      "imageUrl": "string",
      "link": "string (optional)"
    }
  ]
}
```

#### Fields

- `id` (string): Unique identifier for the category.
- `name` (string): Name of the category (e.g., "Tyres and related products").
- `imageUrl` (string): URL for the category image.
- `link` (string, optional): Link to the category page on Autodoc if available.

### `data.json`

This file contains detailed product data for each category. Each category may contain an `items` list or a `subCategories` list.

#### Structure

```json
{
  "categories": [
    {
      "categoryId": "string",
      "categoryName": "string",
      "categoryImageUrl": "string",
      "categoryLink": "string (optional)",
      "items": [
        {
          "itemId": "string",
          "itemName": "string",
          "itemLink": "string",
          "itemImageUrl": "string"
        }
      ],
      "subCategories": [
        {
          "subCategoryId": "string",
          "subCategoryName": "string",
          "subCategoryImageUrl": "string",
          "subCategoryLink": "string",
          "items": [
            {
              "itemId": "string",
              "itemName": "string",
              "itemLink": "string",
              "itemImageUrl": "string"
            }
          ]
        }
      ]
    }
  ]
}
```

#### Fields

- **categoryId** (string): Unique identifier for the category.
- **categoryName** (string): Name of the category.
- **categoryImageUrl** (string): URL for the category image.
- **categoryLink** (string, optional): Link to the category page on Autodoc if available.
- **items** (array): List of items within the category. Only included if the category does not contain nested subcategories.
  - **itemId** (string): Unique identifier for the item.
  - **itemName** (string): Name of the item.
  - **itemLink** (string): Link to the item page on Autodoc.
  - **itemImageUrl** (string): URL for the item image.
- **subCategories** (array): List of nested subcategories within the category. Only included if the category contains subcategories.
  - **subCategoryId** (string): Unique identifier for the subcategory.
  - **subCategoryName** (string): Name of the subcategory.
  - **subCategoryImageUrl** (string): URL for the subcategory image.
  - **subCategoryLink** (string): Link to the subcategory page on Autodoc.
  - **items** (array): List of items within the subcategory.
    - **itemId** (string): Unique identifier for the item within the subcategory.
    - **itemName** (string): Name of the item.
    - **itemLink** (string): Link to the item page on Autodoc.
    - **itemImageUrl** (string): URL for the item image.

# Autodoc Vehicle API Documentation

The Autodoc Vehicle API provides information on car makers, models, vehicles (based on fuel type or engine specifications), and error handling for vehicle selection.

## Endpoint: GET /ajax/selector/vehicle

### Description

This endpoint returns data for selecting a vehicle on the Autodoc platform, including car makers, models, vehicle specifications, and validation errors.

### Response Structure

The response contains the following properties:

- `makers`: Array of car makers, both popular and alphabetical.
- `models`: Available car models for each maker.
- `vehicles`: Vehicle configurations based on specifications like fuel type or engine.
- `selected`: Current vehicle selection by the user.
- `defaultErrors`: Validation error messages for vehicle selection.

### `makers`

An array of objects representing car makers, both popular and alphabetically ordered.

```json
"makers": [
  {
    "label": "Popular carmakers",
    "options": [
      { "id": 16, "name": "BMW" },
      { "id": 121, "name": "VW" }
    ]
  },
  {
    "label": "Carmakers are arranged in alphabetical order",
    "options": [
      { "id": 3854, "name": "ABARTH" },
      { "id": 609, "name": "AC" },
      { "id": 1505, "name": "ACURA" }
    ]
  }
]
```

### `models`

Available models for each car maker, grouped by model name.

```json
"models": [
  {
    "label": "ACTIVA",
    "options": [
      { "id": 5853, "name": "Activa Mk4 Hatchback (KJ,KL,KM) (09.1995 - 09.2000)" },
      { "id": 5855, "name": "Activa Mk4 Hatchback (KJ,KL,KM) (10.2000 - ...)" }
    ]
  }
]
```

### `vehicles`

Available vehicle configurations, grouped by specification like fuel type.

```json
"vehicles": [
  {
    "label": "Petrol",
    "options": [
      { "id": 21626, "name": "1.6 (66 kW / 90 hp) (09.1995 - 09.2000)" },
      { "id": 21627, "name": "1.8 GLX (84 kW / 114 hp) (09.1995 - 09.2000)" }
    ]
  }
]
```

### `selected`

Information about the user's current vehicle selection.

```json
"selected": {
  "maker": 36,
  "model": 5853,
  "car": -1
}
```

### `defaultErrors`

Validation error messages for the vehicle selection process.

```json
"defaultErrors": {
  "number_not_enter": "Please enter your car registration number",
  "invalid_quantity_symbols": "The number entered is not valid"
}
```

## Endpoint: GET /ajax/selector/vehicle?maker=maker&action=models

This endpoint returns a list of car models for a specified car maker.

### Required Query Parameters

- **maker** (integer): The ID of the car maker.
- **action** (string): Must be set to `"models"`.

### Response

```json
{
  "models": [
    {
      "label": "ACTIVA",
      "options": [
        {
          "id": 5853,
          "name": "Activa Mk4 Hatchback (KJ,KL,KM) (09.1995 - 09.2000)"
        },
        {
          "id": 5855,
          "name": "Activa Mk4 Hatchback (KJ,KL,KM) (10.2000 - ...)"
        }
      ]
    }
  ]
}
```

## Endpoint: GET /ajax/selector/vehicle?model=model&action=vehicles

This endpoint retrieves a list of vehicle configurations for a specified car model.

### Required Query Parameters

- **model** (integer): The ID of the car model.
- **action** (string): Must be set to `"vehicles"`.

### Response

```json
{
  "vehicles": [
    {
      "label": "Petrol",
      "options": [
        {
          "id": 21626,
          "name": "1.6 (66 kW / 90 hp) (09.1995 - 09.2000)"
        },
        {
          "id": 21627,
          "name": "1.8 GLX (84 kW / 114 hp) (09.1995 - 09.2000)"
        }
      ]
    }
  ]
}
```

## Endpoint: POST /ajax/selector/vehicle/search

This endpoint performs a search based on various parameters and returns a direct URL to the part's page on the Autodoc website.

### Request Body Parameters

- **nodeId** (integer): ID of the specific item being searched.
- **nodeAlias** (string): Name of the item in lowercase, connected by hyphens.
- **makerId** (integer): ID of the car manufacturer.
- **modelId** (integer): ID of the car model.
- **carId** (integer): ID of the specific car configuration.
- **route** (string): Static string value, set to `"category_car_list"`.
- **eventObject** (string): Static string value, set to `"block"`.

### Response

```json
{
  "url": "https://www.autodoc.co.uk/car-parts/brake-pad-set-10130/ford/activa/activa-mk4-hatchback-kj-kl-km/21627-1-8-glx"
}
```
