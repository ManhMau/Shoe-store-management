$(document).ready(function () {
    const apiBaseUrl = "https://localhost:7203/";

    function resetErrorMessage(field) {
        $(`#${field}-error`).text("");
    }
    function loadDropdowns() {
        $.get(apiBaseUrl + "api/Category", function (categories) {
            categories.forEach(category => {
                $("#category-id").append(`<option value="${category.categoryId}">${category.categoryName}</option>`);
            });
        });

        $.get(apiBaseUrl + "api/Supplier", function (suppliers) {
            suppliers.forEach(supplier => {
                $("#supplier-id").append(`<option value="${supplier.supplierId}">${supplier.supplierName}</option>`);
            });
        });
    }

    loadDropdowns();

    $("#create-product-form").submit(function (e) {
        e.preventDefault();

        const productData = {
            productName: $("#product-name").val(),
            description: $("#description").val(),
            price: $("#price").val() && !isNaN(parseFloat($("#price").val())) ? parseFloat($("#price").val()) : null,
            quantity: $("#quantity").val() && !isNaN(parseInt($("#quantity").val())) ? parseInt($("#quantity").val()) : null,
            size: $("#size").val(),
            color: $("#color").val(),
            brand: $("#brand").val(),
            image: $("#image").val(),
            categoryId: $("#category-id").val() ? parseInt($("#category-id").val()) : null,
            supplierId: $("#supplier-id").val() ? parseInt($("#supplier-id").val()) : null
        };

        $(".error-message").text("");

        $.ajax({
            url: apiBaseUrl + "api/Product",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(productData),
            success: function () {
                alert("Thêm sản phẩm thành công!");
                window.location.href = "/Product"; 
            },
            error: function (error) {
                if (error.status === 409 && error.responseJSON && error.responseJSON.message) {
                    alert(error.responseJSON.message); 
                }
                else if (error.status === 400 && error.responseJSON) {
                    const errors = error.responseJSON.errors;

                    if (errors.ProductName) {
                        $("#product-name-error").text(errors.ProductName.join(", "));
                    }
                    if (errors.Price) {
                        $("#price-error").text(errors.Price.join(", "));
                    }
                    if (errors.Quantity) {
                        $("#quantity-error").text(errors.Quantity.join(", "));
                    }
                    if (errors.Size) {
                        $("#size-error").text(errors.Size.join(", "));
                    }

                    if (errors.CategoryId) {
                        $("#category-id-error").text(errors.CategoryId.join(", "));
                    }
                    if (errors.SupplierId) {
                        $("#supplier-id-error").text(errors.SupplierId.join(", "));
                    }
                    if (errors.Image) {
                        $("#image-error").text(errors.Image.join(", "));
                    }
                } else {
                    alert("Có lỗi xảy ra khi thêm sản phẩm.");
                    console.error(error.responseText);
                }
            }
        });
    });
    $("#product-name").on("input", function () {
        resetErrorMessage("product-name");
    });

    $("#price").on("input", function () {
        resetErrorMessage("price");
    }); $("#quantity").on("input", function () {
        resetErrorMessage("quantity");
    });

    $("#size").on("input", function () {
        resetErrorMessage("size");
    }); $("#category-id").on("input", function () {
        resetErrorMessage("category-id");
    });

    $("#supplier-id").on("input", function () {
        resetErrorMessage("supplier-id");
    });
    $("#image").on("input", function () {
        resetErrorMessage("image");
    });
});
