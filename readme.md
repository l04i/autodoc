# Autodoc Web Scraping Data Documentation

This documentation provides an overview of the JSON data structure used for the Autodoc web scraping task. The data is organized into two files:

- **categories.json**: Contains basic information for the 38 main product categories.
- **data.json**: Contains detailed data for each category, including nested subcategories and individual items.

## File Structure Overview

### 1. `categories.json`

This file contains the high-level categories of car parts, each represented with an ID, name, and image URL. Some categories also include a link to the Autodoc website.

#### Structure

````json
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

#### Fields

* `id` (string): Unique identifier for the category.
* `name` (string): Name of the category (e.g., "Tyres and related products").
* `imageUrl` (string): URL for the category image.
* `link` (string, optional): Link to the category page on Autodoc if available.

#### Example

```json
{
  "categories": [
    {
      "id": "11000",
      "name": "Tyres and related products",
      "imageUrl": "https://scdn.autodoc.de/catalog/categories/600x600/11000.png"
    },
    {
      "id": "10435",
      "name": "Oils and fluids",
      "imageUrl": "https://scdn.autodoc.de/catalog/categories/600x600/10435.png",
      "link": "https://www.autodoc.co.uk/car-parts/oils-and-fluids"
    }
  ]
}


### 2. `data.json`

This file contains detailed product data for each category. Each category may contain:

* An `items` list, if the category does not contain nested subcategories.
* A `subCategories` list, for categories with nested subcategories, with each subcategory containing its own `items`.

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


#### Fields in `data.json`

- **categoryId** (string): Unique identifier for the category.
- **categoryName** (string): Name of the category (e.g., "Tyres and related products").
- **categoryImageUrl** (string): URL for the category image.
- **categoryLink** (string, optional): Link to the category page on Autodoc if available.
- **items** (array): List of items within the category. Only included if the category does not contain nested subcategories.
  - **itemId** (string): Unique identifier for the item.
  - **itemName** (string): Name of the item (e.g., "Tyres").
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

#### Example

```json
{
  "categories": [
    {
      "categoryId": "11000",
      "categoryName": "Tyres and related products",
      "categoryImageUrl": "https://scdn.autodoc.de/catalog/categories/600x600/11000.png",
      "items": [
        {
          "itemId": "23208",
          "itemName": "Tyres",
          "itemLink": "https://www.autodoc.co.uk/tyres",
          "itemImageUrl": "https://scdn.autodoc.de/catalog/categories/100x100/23208.png"
        }
      ]
    },
    {
      "categoryId": "10435",
      "categoryName": "Oils and fluids",
      "categoryImageUrl": "https://scdn.autodoc.de/catalog/categories/600x600/10435.png",
      "categoryLink": "https://www.autodoc.co.uk/car-parts/oils-and-fluids",
      "subCategories": [
        {
          "subCategoryId": "20435",
          "subCategoryName": "Engine Oils",
          "subCategoryImageUrl": "https://scdn.autodoc.de/catalog/categories/600x600/20435.png",
          "subCategoryLink": "https://www.autodoc.co.uk/car-parts/engine-oils",
          "items": [
            {
              "itemId": "33208",
              "itemName": "5W-30 Engine Oil",
              "itemLink": "https://www.autodoc.co.uk/engine-oils/5w-30",
              "itemImageUrl": "https://scdn.autodoc.de/catalog/categories/100x100/33208.png"
            }
          ]
        }
      ]
    }
  ]
}

````

# Autodoc Vehicle API Documentation

The Autodoc Vehicle API provides information on car makers, models, vehicles (based on fuel type or engine specifications), and error handling for vehicle selection. This documentation outlines the structure of the response and provides details on each component.

## Endpoint GET https://www.autodoc.co.uk/ajax/selector/vehicle

### Description

This endpoint returns all relevant data for selecting a vehicle on the Autodoc platform. The response includes a list of popular and alphabetical car makers, vehicle models, available vehicles with specifications, and validation errors.

## Response Structure

The response object contains the following properties:

- `makers`: Array of objects representing popular car makers and an alphabetically ordered list of all available car makers.
- `models`: Array of objects containing different car models associated with each maker.
- `vehicles`: Array of objects representing vehicles based on specifications such as fuel type or engine power.
- `selected`: Object containing the selected vehicle information based on user input.
- `defaultErrors`: Object with default error messages for invalid or missing vehicle input.

---

### makers

An array that contains objects representing car makers, both popular and arranged alphabetically.

#### Sample Structure

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



#### Fields

* **label** (string): Describes the type of car makers (e.g., popular or alphabetically ordered).
* **options** (array): List of car makers.
  * **id** (integer): Unique identifier for the car maker.
  * **name** (string): Name of the car maker.

### models
An array containing available models for selected car makers. Each model is grouped by a `label`, which is the model name, and includes various options.

"models": [
  {
    "label": "ACTIVA",
    "options": [
      { "id": 5853, "name": "Activa Mk4 Hatchback (KJ,KL,KM) (09.1995 - 09.2000)" },
      { "id": 5855, "name": "Activa Mk4 Hatchback (KJ,KL,KM) (10.2000 - ...)" },
      { "id": 5854, "name": "Activa Mk4 Saloon (KJ,KL,KM) (09.1995 - 09.2000)" },
      { "id": 5856, "name": "Activa Mk5 Saloon (KJ,KL,KM) (10.2000 - ...)" }
    ]
  }
]

#### Fields

* **label** (string): Model name for the vehicle (e.g., "ACTIVA").
* **options** (array): List of model variations or configurations.
  * **id** (integer): Unique identifier for the model option.
  * **name** (string): Description of the model option, typically including type and production period.

### vehicles
An array of available vehicle options based on specifications like fuel type, engine power, and production date. Each entry groups vehicles by `label` (e.g., "Petrol") and provides various options.

"vehicles": [
  {
    "label": "Petrol",
    "options": [
      { "id": 21626, "name": "1.6 (66 kW / 90 hp) (09.1995 - 09.2000)" },
      { "id": 21627, "name": "1.8 GLX (84 kW / 114 hp) (09.1995 - 09.2000)" }
    ]
  }
]


#### Fields

* **label** (string): Specification label for the vehicle group (e.g., "Petrol").
* **options** (array): List of specific vehicle configurations.
  * **id** (integer): Unique identifier for the vehicle configuration.
  * **name** (string): Description of the vehicle configuration, typically including engine power and production date.

### selected
The `selected` object contains information about the current vehicle selections made by the user. If no selection has been made for a certain field, its value will be set to `-1`.

"selected": {
  "maker": 36,
  "model": 5853,
  "car": -1
}

#### Fields

* **maker** (integer): ID of the selected car maker.
* **model** (integer): ID of the selected model.
* **car** (integer): ID of the selected car configuration. A value of `-1` indicates no selection.

### defaultErrors
The `defaultErrors` object contains validation error messages for different fields in the vehicle selection process. These messages are displayed when input is invalid or missing.

"defaultErrors": {
  "number_not_enter": "Please enter your car registration number",
  "invalid_quantity_symbols": "The number entered is not valid",
  "invalid_symbols": "Please use letters and digits only",
  "please_select_car": "",
  "auto_not_selected": "",
  "model_not_selected": "",
  "car_not_selected": ""
}




```

## Endpoint: GET https://www.autodoc.co.uk/ajax/selector/vehicle?maker=maker&action=models

This endpoint returns a list of car models associated with a specified car maker, allowing the user to view available models and select specific configurations for each model.

### Required Query Parameters

- **maker** (integer): The ID of the car maker (e.g., `36` for a particular car brand).
- **action** (string): Must be set to `models` to retrieve models for the specified maker.

### Example Request

### Sample Response

````json
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
        },
        {
          "id": 5854,
          "name": "Activa Mk4 Saloon (KJ,KL,KM) (09.1995 - 09.2000)"
        },
        {
          "id": 5856,
          "name": "Activa Mk5 Saloon (KJ,KL,KM) (10.2000 - ...)"
        }
      ]
    },
    {
      "label": "B-MAX",
      "options": [
        {
          "id": 10257,
          "name": "B-Max (JK8) (10.2012 - ...)"
        }
      ]
    }
  ]
}

### Response Details

* **models** (array): A list of models associated with the specified car maker.
  * **label** (string): The name of the car model series.
  * **options** (array): Available configurations for each model.
    * **id** (integer): Unique identifier for the model configuration.
    * **name** (string): Detailed description of the model configuration.

## Endpoint: GET https://www.autodoc.co.uk/ajax/selector/vehicle?model=model&action=vehicles

This endpoint retrieves a list of vehicle configurations (e.g., engine types and fuel options) associated with a specified car model, enabling users to select specific variants.


### Required Query Parameters

- **model** (integer): The ID of the car model for which vehicle configurations are being retrieved (e.g., `5853` for a particular model).
- **action** (string): Must be set to `vehicles` to retrieve vehicle details for the specified model.


### Sample Response

```json
{
  "vehicles": [
    {
      "label": "Petrol",
      "options": [
        {
          "id": 21626,
          "name": "1.6 (66 kW / 90 hp)  (09.1995 - 09.2000)"
        },
        {
          "id": 21627,
          "name": "1.8 GLX (84 kW / 114 hp)  (09.1995 - 09.2000)"
        }
      ]
    }
  ]
}

### Response Details

* **vehicles** (array): Available vehicle configurations.
  * **label** (string): Vehicle classification (e.g. "Petrol").
  * **options** (array):
    * **id** (integer): Unique identifier.
    * **name** (string): Configuration details like engine, power, and production years.



## Endpoint: POST https://www.autodoc.co.uk/ajax/selector/vehicle/search

This endpoint performs a search based on specific parameters such as item ID, item name, maker ID, model ID, and car ID. It returns a direct URL to the part’s page on the Autodoc website.


### Request Body Parameters

- **nodeId** (integer): ID of the specific item being searched for, such as an oil filter.
- **nodeAlias** (string): Name of the item in lowercase, connected by hyphens (e.g., `"oil-filter"`).
- **makerId** (integer): ID of the car manufacturer (e.g., `36` for Ford).
- **modelId** (integer): ID of the car model associated with the part.
- **carId** (integer): ID of the specific car configuration (e.g., engine type, year).
- **route** (string): Static string value, set to `"category_car_list"`.
- **eventObject** (string): Static string value, set to `"block"`.

### Example Request

```json
{
  "nodeId": 10359,
  "nodeAlias": "oil-filter",
  "makerId": 36,
  "modelId": 1686,
  "carId": 15171,
  "route": "category_car_list",
  "eventObject": "block"
}

### Request Body (Raw)

The body should be sent in `x-www-form-urlencoded` format as follows:

nodeId=10130&nodeAlias=brake-pad-set&makerId=36&modelId=1686&carId=15171&route=category_car_list&eventObject=block


### Body Parameters Explained

- **nodeId**: `10130` - The ID of the specific item being searched for, in this case, a brake pad set.
- **nodeAlias**: `"brake-pad-set"` - A hyphenated string representing the item name in lowercase.
- **makerId**: `36` - The ID for the car manufacturer (e.g., `36` for Ford).
- **modelId**: `1686` - The ID of the car model for which the part is being searched.
- **carId**: `15171` - The ID of the specific car configuration (engine type, year).
- **route**: `"category_car_list"` - Static string value used for routing.
- **eventObject**: `"block"` - Static string value representing the event source.

### Example Request

```plaintext
POST https://www.autodoc.co.uk/ajax/selector/vehicle/search
Content-Type: application/x-www-form-urlencoded

nodeId=10130&nodeAlias=brake-pad-set&makerId=36&modelId=1686&carId=15171&route=category_car_list&eventObject=block


### Sample Response


{
  "url": "https://www.autodoc.co.uk/car-parts/brake-pad-set-10130/ford/activa/activa-mk4-hatchback-kj-kl-km/21627-1-8-glx"
}

### Response Details

* **url** (string): A direct link to the Autodoc page for the specified car part, containing details about the item type, car make, model, and configuration.
````
