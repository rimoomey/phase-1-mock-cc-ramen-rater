// write your code here
let headerID = 1;
init();

function init() {
  fetch("http://localhost:3000/ramens")
    .then((res) => res.json())
    .then((data) => {
      loadHeader(data);
      // load first ramen in menu after loading header
      loadDetails(document.querySelector("#ramen-menu").querySelector("img"));
    });
  enableEditRamenForm();
  enableNewRamenForm();
  enableDeleteButton();
}

function loadHeader(data) {
  //add event listener to each image on click that calls loadDetails
  data.forEach((datum) => {
    const newIMG = addImageToHeader(datum, headerID);
    headerID++;
    newIMG.addEventListener("click", () => loadDetails(newIMG));
  });
}

//creates necessary attributes in img for later querying and adds image to header

function addImageToHeader(dataPoint, headerID) {
  const img = document.createElement("img");
  img.src = dataPoint.image;
  img.alt = `Photo of ${dataPoint.name}`;
  img.setAttribute('id', `${headerID}`)
  img.setAttribute("ramen-name", `${dataPoint.name}`);
  img.setAttribute("ramen-restaurant", `${dataPoint.restaurant}`);
  img.setAttribute("ramen-rating", `${dataPoint.rating}`);
  img.setAttribute("ramen-comment", `${dataPoint.comment}`);
  document.getElementById("ramen-menu").appendChild(img);

  return img;
}

// loadDetails of ramen in header to detail area

function loadDetails(ramen) {
  const detailDiv = document.querySelector("#ramen-detail");

  detailDiv.querySelector("img.detail-image").src = ramen.src;
  detailDiv.querySelector("img.detail-image").alt = `Photo of ${ramen.name}`;
  detailDiv.querySelector("h2").textContent = ramen.getAttribute("ramen-name");
  detailDiv.querySelector("h3").textContent =
    ramen.getAttribute("ramen-restaurant");

  const rating = document.querySelector("#rating-display");
  rating.textContent = ramen.getAttribute("ramen-rating");

  const comment = document.querySelector("#comment-display");
  comment.textContent = ramen.getAttribute("ramen-comment");
}

// turns on event listener for edit form submission

function enableEditRamenForm() {
  const editForm = document.querySelector("#edit-ramen");

  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const ramenName = document.querySelector("#ramen-detail h2");
    const newRating = editForm.querySelector("#new-rating").value;
    const newComment = editForm.querySelector("#new-comment").value;

    const headerImage = document.querySelector(
      `img[ramen-name="${ramenName.textContent}"]`
    );
    headerImage.setAttribute("ramen-rating", newRating);
    headerImage.setAttribute("ramen-comment", newComment);

    document.querySelector("#rating-display").textContent = `${newRating}`;
    document.querySelector("#comment-display").textContent = `${newComment}`;

    const newDetails = {
        rating: newRating,
        comment: newComment
    }

    patchEditedRamen(newDetails, headerImage.getAttribute('id'));
  });
}

// turns on event listener for delete button

function enableDeleteButton() {
  const deleteButton = document.querySelector("#delete-button");

  deleteButton.addEventListener("click", (e) => {
    const ramenName = document.querySelector("#ramen-detail h2");
    const headerImage = document.querySelector(
      `img[ramen-name="${ramenName.textContent}"]`
    );
    const detailDiv = document.querySelector("#ramen-detail");
    detailDiv.querySelector(
      "img.detail-image"
    ).src = `./assets/image-placeholder.jpg`;
    detailDiv.querySelector("img.detail-image").alt = "placeholder";
    detailDiv.querySelector("h2").textContent = "Insert Name Here";
    detailDiv.querySelector("h3").textContent = "Insert Restaurant Here";

    document.querySelector("#rating-display").textContent =
      "Insert rating here";
    document.querySelector("#comment-display").textContent =
      "Insert comment here";

    headerImage.remove();
    deleteSelectedRamen(headerImage.getAttribute('id'));
  });
}

// turns on the event listener for form submission

function enableNewRamenForm() {
  const newRamenForm = document.querySelector("#new-ramen");

  newRamenForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newRamen = newRamenObject(e.target);
    postNewRamen(newRamen);
    const newRamenIMG = addImageToHeader(newRamen);
    newRamenIMG.addEventListener("click", () => loadDetails(newRamenIMG));
  });
}

//collects data from form and returns new ramen object
function newRamenObject(form) {
  const nameField = document.querySelector("#new-name");
  const restaurantField = document.querySelector("#new-restaurant");
  const imgField = document.querySelector("#new-image");
  const ratingField = document.querySelector("#new-rating");
  const commentField = document.querySelector("#new-comment");

  const newRamen = {
    name: nameField.value,
    restaurant: restaurantField.value,
    image: imgField.value,
    rating: ratingField.value,
    comment: commentField.value,
  };

  return newRamen;
}

//post new ramen
function postNewRamen(ramenObject) {
    fetch("http://localhost:3000/ramens", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(ramenObject)
    });
}

//patch edited ramen
function patchEditedRamen(editedRamenFields, id) {
    fetch(`http://localhost:3000/ramens/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(editedRamenFields)
    });
}

function deleteSelectedRamen(id) {
    fetch(`http://localhost:3000/ramens/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        }
    });
}