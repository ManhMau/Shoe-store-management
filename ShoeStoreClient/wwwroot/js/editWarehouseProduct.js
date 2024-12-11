$(document).ready(function () {
    const apiBaseUrl = "https://localhost:7203/"; 
    const warehouseProductId = $("#warehouseproduct-data").data("warehouseproduct-id");

    function resetErrorMessage(field) {
        $(`#${field}-error`).text("");
    }

    function loadDropdowns(selectedWarehouseId, selectedProductId) {
        $.get(apiBaseUrl + "api/Warehouse", function (warehouses) {
            warehouses.forEach(warehouse => {
                const selected = warehouse.warehouseId === selectedWarehouseId ? "selected" : "";
                $("#warehouse-id").append(`<option value="${warehouse.warehouseId}" ${selected}>${warehouse.warehouseName}</option>`);
            });
        });

        $.get(apiBaseUrl + "api/Product", function (products) {
            products.forEach(product => {
                const selected = product.productId === selectedProductId ? "selected" : "";
                $("#product-id").append(`<option value="${product.productId}" ${selected}>${product.productName}</option>`);
            });
        });
    }

    // Lấy thông tin sản phẩm từ API
    $.ajax({
        url: apiBaseUrl + `api/WarehouseProduct/${warehouseProductId}`,
        type: "GET",
        success: function (warehouseProduct) {
            $("#warehouse-product-id").val(warehouseProduct.warehouseProductId);
            $("#stock-quantity").val(warehouseProduct.stockQuantity);
            loadDropdowns(warehouseProduct.warehouseId, warehouseProduct.productId);
        },
        error: function () {
            alert("Không thể tải thông tin sản phẩm.");
        }
    });

    // Cập nhật thông tin sản phẩm
    $("#edit-warehouse-product-form").submit(function (e) {
        e.preventDefault();

        const updatedWarehouseProduct = {
            warehouseProductId: $("#warehouse-product-id").val(), 
            warehouseId: parseInt($("#warehouse-id").val()),
            productId: parseInt($("#product-id").val()),
            stockQuantity: parseInt($("#stock-quantity").val())
        };

        // Kiểm tra trùng lặp trước khi gửi yêu cầu PUT
        $.get(apiBaseUrl + `api/WarehouseProduct/CheckDuplicate?warehouseId=${updatedWarehouseProduct.warehouseId}&productId=${updatedWarehouseProduct.productId}&warehouseProductId=${updatedWarehouseProduct.warehouseProductId}`, function (exists) {
            if (exists) {
                alert("Sản phẩm này đã có trong kho hàng này.");
                return;
            }

            $.ajax({
                url: apiBaseUrl + `api/WarehouseProduct/${updatedWarehouseProduct.warehouseProductId}`,
                type: "PUT",
                contentType: "application/json",
                data: JSON.stringify(updatedWarehouseProduct),
                success: function () {
                    alert("Cập nhật sản phẩm kho thành công!");
                    window.location.href = "/WarehouseManagement"; 
                },
                error: function (error) {
                if (error.status === 400 && error.responseJSON) {
                    const errors = error.responseJSON.errors;

              
                    if (errors.StockQuantity) {
                        $("#stock-quantity-error").text(errors.StockQuantity.join(", "));
                    }
                } else {
                    alert("Có lỗi xảy ra khi cập nhật sản phẩm trong kho!");
                }
                console.error(error);
                }

            });
        });
    });

  

    $("#stock-quantity").on("input", function () {
        resetErrorMessage("stock-quantity");
    });

});

