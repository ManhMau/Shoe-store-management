$(document).ready(function () {
    const apiBaseUrl = "https://localhost:7203/";
    const orderId = $("#order-data").data("order-id");

    if (orderId) {
        // Gọi API để lấy thông tin đơn hàng
        $.ajax({
            url: apiBaseUrl + `api/Order/${orderId}`, // URL API
            type: "GET",
            success: function (data) {
                if (data) {
                    // Hiển thị thông tin tổng quan đơn hàng
                    $("#order-id").text(data.orderId);
                    $("#user-name").text(data.username);
                    $("#order-date").text(new Date(data.orderDate).toLocaleString());

                    // Tính toán tổng giá trị đơn hàng
                    let totalPrice = 0;
                    if (data.orderDetails && data.orderDetails.length > 0) {
                        let rows = "";
                        data.orderDetails.forEach((detail, index) => {
                            // Không nhân với quantity vì giá đã được tính trong price
                            const itemTotalPrice = detail.price; // Lấy giá đã tính sẵn
                            totalPrice += itemTotalPrice; // Cộng dồn vào tổng giá trị đơn hàng
                            rows += `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${detail.productName}</td>
                                    <td>${detail.quantity}</td>
                                    <td>${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(itemTotalPrice)}</td>
                                </tr>
                            `;
                        });
                        $("#order-detail-table tbody").html(rows);
                    } else {
                        $("#order-detail-table tbody").html("<tr><td colspan='4' style='text-align: center;'>Không có sản phẩm nào trong đơn hàng.</td></tr>");
                    }

                    // Hiển thị tổng giá trị đơn hàng
                    $("#total-price").text(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalPrice));
                    $("#status").text(data.status);
                    $("#shipping-address").text(data.shippingAddress);
                    $("#payment-method").text(data.paymentMethod);
                } else {
                    alert("Không tìm thấy thông tin đơn hàng.");
                }
            },
            error: function (error) {
                alert("Có lỗi xảy ra khi tải thông tin đơn hàng.");
                console.error(error);
            }
        });
    } else {
        alert("Không tìm thấy ID đơn hàng.");
    }
});
