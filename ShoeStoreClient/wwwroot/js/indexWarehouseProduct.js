$(document).ready(function () {
    const apiBaseUrl = "https://localhost:7203/"; 

    $.ajax({
        url: apiBaseUrl + "api/WarehouseProduct", 
        type: "GET",
        success: function (data) {
            const warehouseTableBody = $("#warehouse-table-body");
            data.forEach(warehouseProduct => {
                warehouseTableBody.append(`
                                    <tr>
                                        <td>${warehouseProduct.warehouseProductId}</td>
                                        <td>${warehouseProduct.warehouse.warehouseName}</td>
                                        <td>${warehouseProduct.warehouse.location}</td>
                                        <td>${warehouseProduct.product.productName}</td>
                                        <td>${warehouseProduct.stockQuantity}</td>
                                        <td>
                                            <button onclick="window.location.href='/Product/Detail?productId=${warehouseProduct.product.productId}';" class="btn-detail">Detail</button>
                                              <button onclick="window.location.href='/WarehouseManagement/Edit?warehouseProductId=${warehouseProduct.warehouseProductId}';" class="btn-edit">Edit</button>

                                            <button class="btn-delete" data-id="${warehouseProduct.warehouseProductId}">Delete</button>
                                        </td>
                                    </tr>
                                `);
            });

            $(".btn-delete").click(function () {
                const warehouseProductId = $(this).data("id");

                // Cảnh báo xác nhận xóa
                if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi kho?")) {
                    $.ajax({
                        url: apiBaseUrl + "api/WarehouseProduct/" + warehouseProductId, // API để xóa sản phẩm kho hàng
                        type: "DELETE",
                        success: function () {
                            alert("Sản phẩm đã được xóa khỏi kho.");
                            location.reload(); 
                        },
                        error: function (error) {
                            alert("Lỗi khi xóa sản phẩm.");
                            console.error(error);
                        }
                    });
                }
            });
        },
        error: function (error) {
            alert("Lỗi khi tải dữ liệu kho hàng.");
            console.error(error);
        }
    });
});
