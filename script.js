const url = "https://dummyjson.com/posts?limit=10";
const postContainer = document.querySelector(".post-list");
const postDetailContainer = document.querySelector("#post-details");
const commentContainer = document.querySelector("#comments");
const commentinput = document.querySelector("#comment-input");
const submitComment = document.querySelector("#submit-comment");
const editTitle = document.querySelector("#edit-title");
const editBody = document.querySelector("#edit-body");
const editButton = document.querySelector("#edit-post");

if (postContainer) {

    fetch(url)

        .then(response => {
            if (!response.ok) {
                throw new Error("Error");
            }
            return response.json();
        })

        .then(data => {
            data.posts.forEach(post => {
                postContainer.innerHTML += `
                <div class="post">
                    <h2>${post.title}</h2>
                    <p>${post.body}</p>
                    <button onclick="location.href='post.html?id=${post.id}'">Read More</button>
                </div>
                `;
            });
        })

        .catch(() => {
            postContainer.textContent = "Error fetching posts. ";

        });

}

if (postDetailContainer) {

    let pageUrl = window.location.href;
    let postId = pageUrl.split('=')[1];

    const postDetailUrl = `https://dummyjson.com/posts/${postId}`;

    fetch(postDetailUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error");
            }
            return response.json();
        })

        .then(data => {
            postDetailContainer.innerHTML = `
                    <h2>${data.title}</h2>
                    <p>${data.body}</p>
            `;
        }
        )
        .catch(() => {
            postDetailContainer.textContent = "Error fetching post details.";

        }
        )

    const commentUrl = `https://dummyjson.com/posts/${postId}/comments`;

    fetch(commentUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error");
            }
            return response.json();
        })
        .then(data => {
            data.comments.forEach(comment => {
                commentContainer.innerHTML += `
                    <div class="comment">
                        <h3>${comment.user.username}</h3>
                        <p>${comment.body}</p>
                    </div>
                `;
            });

        })
        .catch(() => {
            commentContainer.textContent = "Error fetching comments.";
        }
        )

    submitComment.addEventListener("click", () => {
        const commentText = commentinput.value
        if (commentText.trim() === "") {
            alert("Comment cannot be empty.");
            return;
        }

        fetch(`https://dummyjson.com/comments/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                body: commentText,
                postId: Number(postId),
                userId: 1
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error");
                }
                return response.json();
            })
            .then(data => {
                commentContainer.innerHTML += `
                    <div class="comment">
                        <h3> New Comment </h3>
                        <p>${data.body}</p>
                    </div>
                `;
                commentinput.value = "";
            })
            .catch(() => {
                alert("Error submitting comment.");
            });


    });

    editButton.addEventListener("click", async () => {
        try {
            const response = await fetch(`https://dummyjson.com/posts/${postId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: editTitle.value,
                    body: editBody.value
                })
            });
            if (!response.ok) {
                throw new Error("Error");
            }
            const data = await response.json();
            postDetailContainer.innerHTML = `
                    <h2>${data.title}</h2>
                    <p>${data.body}</p>
                `;
        } catch (error) {
            postDetailContainer.textContent = "Error updating post.";
        }
    });
}