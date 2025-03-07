async function postRecipe() {
  document.getElementById("postStatus").innerHTML = "sending data...";
  const title = document.getElementById("titleInput").value;
  const summary = document.getElementById("summaryInput").value;
  const ingredients = document
    .getElementById("ingredientsInput")
    .value.split(",")
    .map((item) => item.trim());
  const instructions = document.getElementById("instructionsInput").value;

  try {
    const response = await fetch("/api/recipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, summary, ingredients, instructions }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    document.getElementById("postStatus").innerHTML = "successfully uploaded";
    displayRecipes();
  } catch (error) {
    document.getElementById("postStatus").innerText = "Error";
    console.error("There was a problem with the fetch operation:", error);
  }

  document.getElementById("titleInput").value = "";
  document.getElementById("summaryInput").value = "";
  document.getElementById("ingredientsInput").value = "";
  document.getElementById("instructionsInput").value = "";
}

async function displayRecipes() {
  try {
    document.getElementById("recipeList").innerHTML = "";
    const response = await fetch("/api/recipe");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const recipes = await response.json();
    let recipesHtml = recipes
      .map((recipe) => {
        return `
              <div class="recipe">
                <h2>${recipe.title || "No Title"}</h2>
                <p>${recipe.summary || "No Summary"}</p>
                <p>Ingredients: ${
                  recipe.ingredients && Array.isArray(recipe.ingredients)
                    ? recipe.ingredients.join(", ")
                    : "None"
                }</p>
                <p>Instructions: ${recipe.instructions || "No Instructions"}</p>
              </div>
            `;
      })
      .join("\n");

    document.getElementById("recipeList").innerHTML = recipesHtml;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    document.getElementById("recipeList").innerHTML = "Error loading recipes.";
  }
}

async function loadRecipes() {
  document.getElementById("recipeList").innerText = "Loading recipes...";
  await displayRecipes();
}
document.addEventListener("DOMContentLoaded", loadRecipes);
