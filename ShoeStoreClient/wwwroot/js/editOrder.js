$(document).ready(function () {
    const apiBaseUrl = "https://localhost:7203/";
    const orderId = $("#order-data").data("order-id");

    function resetErrorMessage(field) {
        $(`#${field}-error`).text("");
    }

    $.ajax({
        url: apiBaseUrl + "api/Order/" + orderId,
        type: "GET",
        success: function (data) {
            if (data) {
                $("#status").val(data.status);
                $("#shipping-address").val(data.shippingAddress);
                $("#payment-method").val(data.paymentMethod);
                $("#totalPrice").val(data.totalPrice);
            }
        },
        error: function (error) {
            alert("Có lỗi xảy ra khi tải thông tin đơn hàng.");
            console.error(error);
        }
    });

    $("#save-order").click(function () {
        const updatedOrder = {
            orderId: orderId,
            status: $("#status").val(),
            shippingAddress: $("#shipping-address").val(),
            paymentMethod: $("#payment-method").val(),
            totalPrice: parseFloat($("#totalPrice").val())
        };

        $(".error-message").text("");

        $.ajax({
            url: apiBaseUrl + "api/Order/" + orderId,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(updatedOrder),
            success: function () {
                alert("Cập nhật đơn hàng thành công!");
                window.location.href = "/Order";
            },
            error: function (error) {
                if (error.status === 400 && error.responseJSON) {
                    const errors = error.responseJSON.errors;

                    // Hiển thị lỗi dưới các trường nhập liệu
                    if (errors.Status) {
                        $("#status-error").text(errors.Status.join(", "));
                    }
                    if (errors.ShippingAddress) {
                        $("#shipping-address-error").text(errors.ShippingAddress.join(", "));
                    }
                    if (errors.TotalPrice) {
                        $("#totalPrice-error").text(errors.TotalPrice.join(", "));
                    }
                    if (errors.PaymentMethod) {
                        $("#payment-method-error").text(errors.PaymentMethod.join(", "));
                    }
                } else {
                    alert("Không thể cập nhật đơn hàng!");
                }
                console.error(error);
            }
        });
    });

    // Xóa lỗi khi người dùng thay đổi giá trị
    $("#status").on("input", function () {
        resetErrorMessage("status");
    });

    $("#shipping-address").on("input", function () {
        resetErrorMessage("shipping-address");
    });

    $("#payment-method").on("input", function () {
        resetErrorMessage("payment-method");
    });

    $("#totalPrice").on("input", function () {
        resetErrorMessage("totalPrice");
    });
});