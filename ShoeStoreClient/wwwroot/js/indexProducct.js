$(document).ready(function () {
    const apiBaseUrl = "https://localhost:7203/";

    function loadProducts(searchTerm = "") {
        $.ajax({
            url: apiBaseUrl + "api/Product" + (searchTerm ? `?searchTerm=${searchTerm}` : ""),
            type: "GET",
            success: function (data) {
                if (data && data.length > 0) {
                    let rows = "";
                    data.forEach((product, index) => {
                        rows += `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td>${product.productId}</td>
                                        <td>${product.productName}</td>
                                        <td>${product.description}</td>
                                        <td>${product.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                        <td>${product.quantity}</td>
                                        <td>${product.size}</td>
                                        <td>${product.color}</td>
                                        <td>${product.brand}</td>
                                        <td>
                                            <img src="${product.image}" alt="${product.productName}" style="width: 100px; height: auto;" />
                                        </td>
                                        <td>
                                            <button onclick="window.location.href='/Product/Detail?productId=${product.productId}';" class="btn-detail">Detail</button>
                                            <button onclick="window.location.href='/Product/Edit?productId=${product.productId}';" class="btn-update">Update</button>
                                            <button class="delete-product" data-id="${product.productId}">Delete</button>
                                        </td>
                                    </tr>
                                `;
                    });
                    $("#product-table tbody").html(rows);
                } else {
                    $("#product-table tbody").html("<tr><td style='color: red;' colspan='11' class='text-center'>No products found matching the search criteria.</td></tr>");
                }
            },
            error: function (error) {
                alert("Có lỗi xảy ra khi tải danh sách sản phẩm.");
                console.error(error);
            }
        });
    }

    // Hàm tìm kiếm sản phẩm
    function searchProducts() {
        const searchTerm = $('#searchInput').val().trim(); 
        loadProducts(searchTerm); 
    }

    // Xử lý sự kiện xóa sản phẩm
    $(document).on("click", ".delete-product", function () {
        const productId = $(this).data("id");
        if (confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
            $.ajax({
                url: apiBaseUrl + "api/Product/" + productId,
                type: "DELETE",
                success: function () {
                    alert("Xóa sản phẩm thành công!");
                    loadProducts();
                },
                error: function (error) {
                    alert("Không thể xóa sản phẩm!");
                    console.error(error);
                }
            });
        }
    });

    loadProducts();

    $("#searchBtn").on("click", function () {
        searchProducts();
    });

    $('#searchInput').on('keypress', function (e) {
        if (e.which === 13) {
            searchProducts();
        }
    });
});
