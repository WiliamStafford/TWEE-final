document.addEventListener("DOMContentLoaded", function () {
    const cartPanel = document.getElementById("cart-panel");
    const cartList = document.getElementById("cart-list");
    const cartTotal = document.getElementById("cart-total");
    const clearCart = document.getElementById("clear-cart");
    const closeCart = document.getElementById("close-cart");
    const cartCountEls = document.querySelectorAll(".cart-value");
    
    // Sử dụng sessionStorage theo yêu cầu
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    // 🧮 Cập nhật hiển thị tổng số sản phẩm trên icon
    function updateCartCount() {
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        cartCountEls.forEach(el => el.textContent = totalQty);
    }

    // 🧾 Cập nhật UI trong panel giỏ hàng và lưu vào sessionStorage
    function updateCartUI() {
        cartList.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            const li = document.createElement("li");
            li.style.display = "flex";
            li.style.alignItems = "center";
            li.style.justifyContent = "space-between";
            li.style.padding = "8px 0";
            li.style.borderBottom = "1px solid #eee";

            li.innerHTML = `
                <span style="flex:2;">${item.name}</span>
                <div style="display:flex;align-items:center;gap:4px;flex:1;justify-content:center;">
                    <button class="decrease" data-index="${index}"
                        style="width:26px;height:26px;border:none;background:#ccc;border-radius:4px;">-</button>
                    <span>${item.qty}</span>
                    <button class="increase" data-index="${index}"
                        style="width:26px;height:26px;border:none;background:#ccc;border-radius:4px;">+</button>
                </div>
                <span style="flex:1;text-align:right;">${(item.price * item.qty).toLocaleString('vi-VN')}₫</span>
            `;
            cartList.appendChild(li);
            total += item.price * item.qty;
        });

        cartTotal.textContent = total.toLocaleString('vi-VN') + "₫";
        updateCartCount();
        sessionStorage.setItem("cart", JSON.stringify(cart));
    }

    // 🛍️ Khi nhấn “ĐẶT MUA” (Chỉ thêm sản phẩm và KHÔNG mở panel)
    document.querySelectorAll(".btn.cta").forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            
            const card = this.closest(".card"); 
            if (!card) return; 

            const titleEl = card.querySelector(".card-body .title");
            const priceEl = card.querySelector(".card-body .price");

            const name = titleEl ? titleEl.textContent.trim() : "Sản phẩm";
            const priceText = priceEl ? priceEl.textContent.trim() : "0";
            const price = parseInt(priceText.replace(/\D/g, ""), 10) || 0; 

            const existing = cart.find(item => item.name === name);
            if (existing) {
                existing.qty++;
            } else {
                cart.push({ name, price, qty: 1 });
            }

            // ⭐ ĐIỂM SỬA CHỮA 1: Chỉ cập nhật UI (Giỏ hàng trên Header tăng lên), KHÔNG mở panel.
            updateCartUI(); 
            
            // alert (Tùy chọn: thông báo đã thêm hàng)
            // alert(`✅ Đã thêm 1 ${name} vào giỏ hàng!`);
        });
    });

    // 🧹 Nút xóa tất cả
    clearCart.addEventListener("click", () => {
        if (confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng không?")) {
            cart = [];
            updateCartUI();
            sessionStorage.removeItem("cart");
        }
    });

    // ❌ Nút đóng panel
    closeCart.addEventListener("click", () => {
        cartPanel.style.right = "-400px";
    });
	// 📩 Nút gửi yêu cầu
const sendRequestBtn = document.getElementById("send-request");
const successMessage = document.getElementById("success-message");

sendRequestBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Giỏ hàng đang trống, không thể gửi yêu cầu!");
    return;
  }

  // Hiện thông báo thành công
  successMessage.style.display = "block";

  // Ẩn sau 3 giây
  setTimeout(() => {
    successMessage.style.display = "none";
  }, 3000);

  // (Tùy chọn) có thể clear giỏ hàng sau khi gửi
  // cart = [];
  // updateCartUI();
});


    // ➕➖ Tăng giảm số lượng
    cartList.addEventListener("click", (e) => {
        const btn = e.target;
        if (btn.classList.contains("increase")) {
            const i = btn.dataset.index;
            cart[i].qty++;
            updateCartUI();
        }
        if (btn.classList.contains("decrease")) {
            const i = btn.dataset.index;
            cart[i].qty--;
            if (cart[i].qty <= 0) cart.splice(i, 1);
            updateCartUI();
        }
    });

    // 🛒 Mở panel khi bấm icon giỏ hàng
    // ⭐ ĐIỂM SỬA CHỮA 2: Giữ nguyên logic này để chỉ mở panel khi bấm vào icon.
    document.querySelectorAll(".cart-icon").forEach(icon => {
        icon.addEventListener("click", (e) => {
            e.preventDefault();
            cartPanel.style.right = "0";
        });
    });

    // 🔄 Cập nhật khi tải trang
    updateCartUI();
});
