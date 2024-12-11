$(document).ready(function () {
    const apiBaseUrl = "https://localhost:7203/";
    const productId = $("#product-data").data("product-id");

    function resetErrorMessage(field) {
        $(`#${field}-error`).text("");
    }

    // Tải danh mục và nhà cung cấp
    function loadDropdowns(selectedCategoryId, selectedSupplierId) {
        $.get(apiBaseUrl + "api/Category", function (categories) {
            categories.forEach(category => {
                const selected = category.categoryId === selectedCategoryId ? "selected" : "";
                $("#category-id").append(`<option value="${category.categoryId}" ${selected}>${category.categoryName}</option>`);
            });
        });

        $.get(apiBaseUrl + "api/Supplier", function (suppliers) {
            suppliers.forEach(supplier => {
                const selected = supplier.supplierId === selectedSupplierId ? "selected" : "";
                $("#supplier-id").append(`<option value="${supplier.supplierId}" ${selected}>${supplier.supplierName}</option>`);
            });
        });
    }

    // Tải thông tin sản phẩm
    $.ajax({
        url: apiBaseUrl + `api/Product/${productId}`,
        type: "GET",
        success: function (product) {
            $("#product-name").val(product.productName);
            $("#description").val(product.description);
            $("#price").val(product.price);
            $("#quantity").val(product.quantity);
            $("#size").val(product.size);
            $("#color").val(product.color);
            $("#brand").val(product.brand);
            $("#image").val(product.image);

            // Tải dropdown với giá trị được chọn
            loadDropdowns(product.categoryId, product.supplierId);
        },
        error: function () {
            alert("Không thể tải thông tin sản phẩm.");
        }
    });

    // Cập nhật sản phẩm
    $("#edit-product-form").submit(function (e) {
        e.preventDefault();

        const productData = {
            productId: productId,
            productName: $("#product-name").val(),
            description: $("#description").val(),
            price: parseFloat($("#price").val()),
            quantity: parseInt($("#quantity").val()),
            size: $("#size").val(),
            color: $("#color").val(),
            brand: $("#brand").val(),
            image: $("#image").val(),
            categoryId: parseInt($("#category-id").val()),
            supplierId: $("#supplier-id").val() ? parseInt($("#supplier-id").val()) : null
        };

        $.ajax({
            url: apiBaseUrl + `api/Product/${productId}`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(productData),
            success: function () {
                alert("Cập nhật sản phẩm thành công!");
                window.location.href = "/Product"; // Quay lại trang danh sách
            },
            error: function (error) {
                if (error.status === 409 && error.responseJSON && error.responseJSON.message) {
                    alert(error.responseJSON.message); 
                }
                else if (error.status === 400 && error.responseJSON) {
                    const errors = error.responseJSON.errors;

                    // Hiển thị lỗi cho từng trường nhập liệu tương ứng
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
                    alert("Có lỗi xảy ra khi cập nhật sản phẩm.");
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
