
$(document).ready(function () {
    const apiBaseUrl = "https://localhost:7203/"; 
    const productId = $("#product-data").data("product-id");

    $.ajax({
        url: apiBaseUrl + "api/Product/" + productId, // Đảm bảo URL chính xác
        type: "GET",
        success: function (data) {
            if (data) {
                const productDetailHtml = `
    <div class="product-info">
        <img src="${data.image}" alt="${data.productName}" />
        <p><strong>Product Name:</strong> ${data.productName}</p>
        <p><strong>Description:</strong> ${data.description}</p>
        <p><strong>Price:</strong> ${data.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
        <p><strong>Quantity:</strong> ${data.quantity}</p>
        <p><strong>Size:</strong> ${data.size}</p>
        <p><strong>Color:</strong> ${data.color}</p>
        <p><strong>Brand:</strong> ${data.brand}</p>
    </div>
    `;
                $("#product-info").html(productDetailHtml); 
            } else {
                alert("Không tìm thấy sản phẩm.");
            }
        },
        error: function (error) {
            alert("Có lỗi xảy ra khi tải chi tiết sản phẩm.");
            console.error(error);
        }
    });
});
