# Meal-App

Meal app for the Prog-4 course project

## Overview

The application allows the user to find recipes by going through a 3 step process by:

- Filtering the recipes database by the ingredients that were entered by the user.
- Filtering the recipes database by the allergies that were chosen by the user.
- Filtering the recipes database by the diets that were chosen by the user.

After the filtering process, if there were matching results to the user preferences, the user can see the necessary details on the recipes of their interest and add it to their grocery list.

The development is done collaboratively using GitHub for version control.

## Getting started

## Frontend

1. Clone the repository
    ```
   git clone https://github.com/yourusername/meal-app.git
   ```
2. Navigate to project directory
    ```
   cd sigmameals
   ```
 
3. Install dependencies

   ```bash
   npm install
   ```

4. Start the app

   ```bash
    npx expo start
   ```
## Backend
For backend use a separate terminal
1. Install docker

2. Build Docker
      ```bash
    docker compose up phpmyadmin database backend 
   ```
4. Start Docker
      ```bash
    docker compose up
   ```
> **Note:** Make your own .env for docker-compose.yml and fill out the following:
      
      DB_HOST: ${DB_HOST}
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_NAME: ${DB_NAME}
      DB_PORT: ${DB_PORT}
      SECRET: ${SECRET}

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo



## Programming Language

The application is implemented in React Native.

## Usage

1. **Ingredients View**: The user can enter ingredients into the input bar to begin the filtering process.
2. **Allergies View**: The user can choose the following tags that appear on the page to filter recipes by allergies.
3. **Diets View**: The user can choose the following tags that appear on the page to filter recipes by diets.
4. **Results View**: Any recipes that fulfill the restrictions based on the 3 previous page will be shown here, otherwise if there were no recipes, then user will be notified.
5. **Meal Details View**: When a user clicks on one of the resulting recipes, neccesary information will be displayed to the user. This includes the ingredients needed to make the food, the nutritional value of the recipe, the steps to make the recipe, and etc. The user can also add the recipe into the grocery view.
6. **Grocery View**: Any recipes that the user decided to add to their grocery list will be shown here. The information shown here is the name of the recipe and the ingredients needed to make the food.

## Backend

The backend for this application used a dataset that was provided by https://www.kaggle.com/datasets/crispen5gar/recipes3k?select=recipes.json. Missing information had been manually added by referring to the source that was present in this dataset. The data has been prepared and cleaned using juypter notebook. The backend for our database is hosted on Google Cloud Platform.

## API Overview

This API allows users to filter recipes by ingredients, allergies, diets and grab the results after the filters. The parameters of the endpoints are designed to take in multiple inputs as shown in the following examples.

### Base URL

`http://localhost:3000`
> **Note:** The Base URL wont work with localhost, use IPv4 address

### Authentication

No authentication is required for this API.

---

## Endpoints Overview

- [GET /api/food/?ingredients={ingredients}](#get-recipes-by-ingredients)
- [GET /api/allergies/?ids={ids}&allergies={allergies}](#get-recipes-by-allergies)
- [GET /api/diets?ids={ids}&diets={diets}](#get-recipes-by-diets)
- [GET /api/results?ids={ids}](#get-recipes-by-all-filters)

---

<a id="get-recipes-by-ingredients"></a>

### GET /api/food?ingredients={ingredients}

**Method**: `GET`

**Endpoint**: `/api/food?ingredients={ingredients}`

**Parameters**:

- `ingredients` (query parameter, required): The ingredients the user provides to the endpoint.

**Description**: Retrieves a list of recipes ids and ingredients associated to that recipe.

**Example Request**:

_Input_:

- `GET api/food?ingredients=egg,milk`

_Output_:

```json
{
   "id": 10,
   "ingredients": "[\"100g noodles (rice, soba or egg)\", \"3 tbsp frozen peas\", \"handful sugar snap peas or mangetout, halved lengthways\", \"handful baby corn, halved lengthways\", \"1 spring onion, sliced\", \"½ red pepper, deseeded and chopped\", \"1 tbsp reduced-salt soy sauce\", \"1 tsp clear honey\", \"½ garlic clove, crushed\", \"juice 1/2 lemon\", \"grating of fresh ginger (optional)\", \"1 tbsp olive oil\", \"splash of milk\", \"2 eggs, beaten\"]"
},

{
   "id": 112,
   "ingredients": "[\"300g self-raising flour\", \"1 tsp bicarbonate of soda\", \"100g light muscovado sugar\", \"50g porridge oats, plus 1 tbsp for topping\", \"2 medium bananas, the riper the better\", \"284ml carton buttermilk\", \"5 tbsp light olive oil\", \"2 egg whites\", \"150g punnet blueberries\"]"
},

  and many more....
```

---

<a id="get-recipes-by-allergies"></a>

### GET /api/allergies?ids={ids}&allergies={allergies}

**Method**: `GET`

**Endpoint**: `/api/allergies?ids={ids}&allergies={allergies}`

**Parameters**:

- `ids` (query parameter, required): The ids is provided by the ingredients api call.
- `allergies` (query parameter, required): The allergies is provided by the user input.

**Description**: Retrieves a list of recipes ids and allergies associated to that recipe.

**Example Request**:

_Input_:

- `GET /api/allergies?ids=1,2,3&allergies=fish`

_Output_:

```json
{
   "id": 2,
   "allergies": "[\"none\"]"
},

{
   "id": 3,
   "allergies": "[\"Gluten\"]"
}
```

---

<a id="get-recipes-by-diets"></a>

### GET /api/diets?ids={ids}&diets={diets}

**Method**: `POST`

**Endpoint**: `/api/diets?ids={ids}&diets={diets}`

**Parameters**:

- `ids` (query parameter, required): The ids is provided by the allergies api call.
- `diets` (query parameter, required): The diets is provided by the user input.

**Description**: Retrieves a list of recipes ids and diets associated to that recipe.

**Example Request**:

_Input_:

- `GET /api/diets?ids=1,2,3&diets=vegetarian`

_Output_:

```json
{
   "id": 2,
   "diet": "[\"dairy free\", \"healthy\", \"vegan\", \"vegetarian\"]"
},

{
   "id": 3,
   "diet": "[\"vegan\", \"vegetarian\"]"
}
```

---

<a id="get-recipes-by-all-filters"></a>

### GET /api/results?ids={ids}

**Method**: `GET`

**Endpoint**: `/api/results?ids={ids}`

**Parameters**:

- `ids` (query parameter, required): The ids is provided by the diets api call.

**Description**: Retrieves a list of recipes ids and the information that relates to that recipes (image, name, description, ingredients, steps, etc).

**Example Request**:

_Input_:

- `GET /api/results?ids=1,545`

_Output_:

```json
{
   "id": 1,
   "image": "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/smoked-salmon-quinoa-dill-lunch-pot-0393a04.jpg",
   "name": "Smoked salmon, quinoa & dill lunch pot",
   "description": "This easy packed lunch is as delicious as it is nutritious, with crunchy cucumber and radishes and a herby, creamy dressing",
   "ingredients": "[\"2 tbsp half-fat soured cream\", \"2 tbsp lemon juice\", \"½ pack dill, finely chopped\", \"250g pouch ready-to-eat quinoa (we used Merchant Gourmet)\", \"½ cucumber, halved and sliced\", \"4 radishes, finely sliced\", \"100g smoked salmon, torn into strips\"]",
   "steps": "[\"First, make the dressing. Mix the soured cream and lemon juice together in a bowl, then add most of the dill, reserving a quarter for serving.\", \"In another bowl, combine the quinoa with the cucumber and radishes, and stir through half the dressing. Season and top with the salmon and the rest of the dill.\", \"Put the other half of the dressing in a small pot and drizzle over the quinoa just before serving.\"]",
   "nutrients": "{\"fat\": \"7g\", \"kcal\": \"254\", \"salt\": \"2.5g\", \"carbs\": \"26g\", \"fibre\": \"5g\", \"sugars\": \"3g\", \"protein\": \"20g\", \"saturates\": \"2g\"}",
   "times": "{\"Cooking\": \"No Time\", \"Preparation\": \"15 mins\"}",
   "serves": 2,
   "diet": "[\"gluten free\"]",
   "allergies": "[\"Fish\"]"
},
{
   "id": 545,
   "image": "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/recipe-image-legacy-id-1069520_11-38d37ad.jpg",
   "name": "5-a-day tagine",
   "description": "Get your day's vegetable quota all in one go. Great for feeding a group, or freeze portions",
   "ingredients": "[\"4 carrots, cut into chunks\", \"4 small parsnips, or 3 large, cut into chunks\", \"3 red onions, cut into wedges\", \"2 red peppers, deseeded and cut into chunks\", \"2 tbsp olive oil\", \"1 tsp each ground cumin, paprika, cinnamon and mild chilli powder\", \"400g can chopped tomato\", \"2 small handfuls soft dried apricots\", \"2 tsp honey\"]",
   "steps": "[\"Heat oven to 200C/fan 180C/gas 6. Scatter the veg over a couple of baking trays, drizzle with half the oil, season, then rub the oil over the veg with your hands to coat. Roast for 30 mins until tender and beginning to brown.\", \"Meanwhile, fry the spices in the remaining oil for 1 min – they should sizzle and start to smell aromatic. Tip in the tomatoes, apricots, honey and a can of water. Simmer for 5 mins until the sauce is slightly reduced and the apricots plump, then stir in the veg and some seasoning. Serve with couscous or jacket potatoes.\"]",
   "nutrients": "{\"fat\": \"8g\", \"kcal\": \"272\", \"salt\": \"0.35g\", \"carbs\": \"45g\", \"fibre\": \"0g\", \"sugars\": \"32g\", \"protein\": \"7g\", \"saturates\": \"1g\"}",
   "times": "{\"Cooking\": \"35 mins\", \"Preparation\": \"10 mins\"}",
   "serves": 4,
   "diet": "[\"dairy free\", \"vegetarian\"]",
   "allergies": "[\"none\"]"
}
```

---

