async function postRecipe() {
  document.getElementById("postStatus").innerHTML = "sending data...";
  const title = document.getElementById("titleInput").value;
  const summary = document.getElementById("summaryInput").value;
  const ingredients = document.getElementById("ingredientsInput").value.split(",").map((item) => item.trim());
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

    const userStatus = await fetch("/api/user/status");
    const userData = await userStatus.json();
    const isAuthenticated = userData.isAuthenticated;
    const currentUser = isAuthenticated ? userData.user.username : null;

    let recipesHtml = recipes.map((recipe) => {
        const likeCount = recipe.likes ? recipe.likes.length : 0;
        const isLiked = recipe.likes && recipe.likes.includes(currentUser);

        return `
          <div class="recipe" data-recipe-id="${recipe._id}">
            <h2>${recipe.title || "No Title"}</h2>
            <p>${recipe.summary || "No Summary"}</p>
            <p><em>Posted by: ${recipe.user || "Anonymous"}</em></p>
            <hr>
            <p><strong>Ingredients: </strong>${
              recipe.ingredients && Array.isArray(recipe.ingredients)
                ? recipe.ingredients.join(", ")
                : "None"
            }</p>
            <hr>
            <p><strong>Instructions: </strong>${
              recipe.instructions || "No Instructions"
            }</p>
            
            <div class="recipe-interactions">
              <div>
                <span title="${recipe.likes ? recipe.likes.join(", ") : ""}"> 
                  ${likeCount} likes 
                </span> &nbsp; &nbsp;
                <span class="heart-button-span ${
                  isAuthenticated ? "" : "d-none"
                }">
                  ${
                    isLiked
                      ? `<button class="heart_button" onclick='unlikeRecipe("${recipe._id}")'>&#x2665;</button>`
                      : `<button class="heart_button" onclick='likeRecipe("${recipe._id}")'>&#x2661;</button>`
                  }
                </span>
              </div>
              <br>
              <button onclick='toggleComments("${recipe._id}")'>View comments</button>
              <div id='comments-box-${recipe._id}' class="comments-box d-none">
                <button onclick='refreshComments("${recipe._id}")'>Refresh comments</button>
                <div id='comments-${recipe._id}'></div>
                <div class="new-comment-box ${isAuthenticated ? "" : "d-none"}">
                  New Comment:
                  <textarea id="new-comment-${recipe._id}"></textarea>
                  <button onclick='postComment("${recipe._id}")'>Post Comment</button>
                </div>
              </div>
            </div>
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

async function likeRecipe(recipeId) {
  try {
    const response = await fetch("/api/recipe/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postID: recipeId }),
    });

    if (!response.ok) {
      throw new Error("Failed to like recipe");
    }

    displayRecipes(); 
  } catch (error) {
    console.error("Error liking recipe:", error);
  }
}

async function unlikeRecipe(recipeId) {
  try {
    const response = await fetch("/api/recipe/unlike", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postID: recipeId }),
    });

    if (!response.ok) {
      throw new Error("Failed to unlike recipe");
    }

    displayRecipes();
  } catch (error) {
    console.error("Error unliking recipe:", error);
  }
}

async function toggleComments(recipeId) {
  const commentsBox = document.getElementById(`comments-box-${recipeId}`);

  if (commentsBox.classList.contains("d-none")) {
    commentsBox.classList.remove("d-none");
    refreshComments(recipeId);
  } else {
    commentsBox.classList.add("d-none");
  }
}

async function refreshComments(recipeId) {
  try {
    const commentsElement = document.getElementById(`comments-${recipeId}`);
    commentsElement.innerHTML = "Loading comments...";

    const response = await fetch(`/api/comments?postID=${recipeId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch comments");
    }

    const comments = await response.json();

    if (comments.length === 0) {
      commentsElement.innerHTML = "<p>No comments yet</p>";
      return;
    }

    const commentsHtml = comments
      .map(
        (comment) => `
          <div class="comment">
            <p><strong>${comment.username || "Anonymous"}</strong>: ${
          comment.comment
        }</p>
            <small>${new Date(comment.created_date).toLocaleString()}</small>
          </div>
        `
      )
      .join("");

    commentsElement.innerHTML = commentsHtml;
  } catch (error) {
    console.error("Error fetching comments:", error);
    document.getElementById(`comments-${recipeId}`).innerHTML =
      "Error loading comments";
  }
}

async function postComment(recipeId) {
  try {
    const commentText = document.getElementById(`new-comment-${recipeId}`).value;

    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        newComment: commentText,
        postID: recipeId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to post comment");
    }

    document.getElementById(`new-comment-${recipeId}`).value = "";
    refreshComments(recipeId);
  } catch (error) {
    console.error("Error posting comment:", error);
    alert("Failed to post comment");
  }
}

async function loadRecipes() {
  document.getElementById("recipeList").innerText = "Loading recipes...";
  await displayRecipes();
}

async function checkAuth() {
  try {
    const response = await fetch("/api/user/status");
    const data = await response.json();
    if (data.isAuthenticated) {
      document.getElementById("make_post_div").classList.remove("d-none");
      document.getElementById("login-status").innerHTML = `Logged in as ${data.user} | <a href="/signout">Logout</a>`;
    } else {
      document.getElementById("make_post_div").classList.add("d-none");
      document.getElementById("login-status").innerHTML = `<a href="/signin">Login</a> to post recipes and comments`;
    }
  } catch (error) {
    console.error("Auth check failed:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadRecipes();
  checkAuth();
});
