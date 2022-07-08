// Client facing scripts here

$(document).ready(function () {
  $("form").submit(() => {
    console.log("Succes");
  });
});

$.post("/voters", safeHTML, JSON);
