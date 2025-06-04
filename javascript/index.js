document.getElementById("code_redeem_submit").addEventListener("click", async function () {
    const code = document.getElementById("code_redeem").value.trim();

    if (!code) {
        alert("Vui lòng nhập mã đổi thưởng!");
        return;
    }

    const apiUrl = "https://script.google.com/macros/s/AKfycbwMauzGikFRi4VjLekL_7bqou98qaP6Gb2YBULTf_DtMjuSLteeBdO1gcP7dtmbd9mK/exec?Redeem_code=" + encodeURIComponent(code);

    const button = document.getElementById("code_redeem_submit");
    button.disabled = true;
    const originalText = button.innerText;
    button.innerText = "Kiểm tra...";

    try {
        const response = await fetch(apiUrl);
        const result = await response.json();

        let message = "";
        if (result.status === "success") {
            const image_Ao = document.getElementById('img_prizes');
            if (result.item === "HEAVY Legacy Card – 5 Years Edition") {
                image_Ao.src = "https://file.hstatic.net/200001005225/file/boxcard_14c3cbc27f504b22bb733f05249e080d.png";
            } else if (result.item === "HEAVY Bucket Hunter") {
                image_Ao.src = "https://file.hstatic.net/200001005225/file/n_n_3805702964cc4c0fbc5ad2b149d61851.png";
            } else if (result.item === "HEAVY Shadow Armor (Limited Edition)") {
                image_Ao.src = "https://file.hstatic.net/200001005225/file/_okhoac_b82a4ed15f7c46db85e63c8ab20ac918.png";
            } else if (result.item === "HEAVY LEGACY CONTINUES") {
                image_Ao.src = "https://file.hstatic.net/200001005225/file/_otrang_0c1202f7ee454af5a8028c7e6413b14a.png";
            } else if (result.item === "HEAVY Pro Jersey 2025") {
                image_Ao.src = "https://file.hstatic.net/200001005225/file/jersey_da2ef868cf234d5fade9c8bd12b20b2c.png";
            }else{
        
                Swal.fire({
                    title: '🎉 Chúc mừng!',
                    html: `
                        Bạn đã nhận được phần thưởng: <strong>${result.item}</strong><br><br>
                        Truy cập HEAVY STORE để sử dụng mã VOUCHER khi mua hàng.<br><br>
                        <a href="https://heavy.gg" target="_blank" class="chuyenTranvoucher swal2-confirm swal2-styled" style="text-decoration: none;">
                             HEAVY STORE
                        </a>
                    `,
                    icon: 'success',
                    showConfirmButton: false
                });
                return;
            }
            const modal = document.getElementById('resultModal');
            modal.classList.remove('hidden');
            modal.setAttribute('aria-hidden', 'false');
        } else if (result.status === "used") {
            alert("⚠️ Mã này đã được sử dụng.");
        } else if (result.status === "not_found") {
            alert("❌ Không tìm thấy mã.");
        } else {
            alert("❗ Lỗi: " + result.message);
        }
    } catch (error) {
        alert("Đã xảy ra lỗi khi gửi yêu cầu: " + error.message);
    } finally {
        button.disabled = false;
        button.innerText = originalText;
    }
});

document.getElementById("confirm_submit").addEventListener("click", async function (event) {
    event.preventDefault();

    const button = document.getElementById("confirm_submit");
    const nuthoat = document.getElementById("nutthoat_");
    const originalText = button.innerText;
    button.disabled = true;
    nuthoat.disabled = true;
    button.innerText = "Đang gửi...";

    const code = document.getElementById("code_redeem").value.trim();
    const fullName = document.getElementById("fullName").value.trim();
    const phoneNumber = document.getElementById("phoneNumber").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();
    const thanhpho = document.getElementById("province").selectedOptions[0].text;
    const quanhuyen = document.getElementById("district").selectedOptions[0].text;
    const phuongxa = document.getElementById("ward").selectedOptions[0].text;

    if (!fullName || !phoneNumber || !email || !address || !thanhpho || !quanhuyen || !phuongxa) {
        alert("Vui lòng điền đầy đủ thông tin!");
        button.disabled = false;
        button.innerText = originalText;
        nuthoat.disabled = false;
        return;
    }

    const url = `https://script.google.com/macros/s/AKfycbzmdam0TO19f6hbW2Vss6MUT6GWKczf4ztKNGnPoZi_HABUZp0SEGV1ieiS3pjyIPWL/exec?Redeem_code=${encodeURIComponent(code)}&fullName=${encodeURIComponent(fullName)}&phoneNumber=${encodeURIComponent(phoneNumber)}&email=${encodeURIComponent(email)}&thanhpho=${encodeURIComponent(thanhpho)}&quanhuyen=${encodeURIComponent(quanhuyen)}&phuongxa=${encodeURIComponent(phuongxa)}&address=${encodeURIComponent(address)}`;

    try {
        const response = await fetch(url);
        const result = await response.json();

        if (result.status === "success") {
            alert("🎉 Gửi thông tin thành công!");
            const modal = document.getElementById('resultModal');
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
        } else {
            alert("❌ Lỗi: " + result.message);
        }
    } catch (error) {
        alert("⚠️ Gửi thất bại: " + error.message);
    } finally {
        button.disabled = false;
        nuthoat.disabled = false;
        button.innerText = originalText;
    }
});

document.getElementById("nutthoat_").addEventListener("click", function () {
    const modal = document.getElementById('resultModal');
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
});

async function fetchProvinces() {
    const res = await fetch("https://provinces.open-api.vn/api/p/");
    const data = await res.json();
    const provinceSelect = document.getElementById("province");
    provinceSelect.innerHTML = `<option value="">--Chọn Tỉnh/Thành--</option>`;
    data.forEach(prov => {
        provinceSelect.innerHTML += `<option value="${prov.code}">${prov.name}</option>`;
    });
}

document.getElementById("province").addEventListener("change", async function () {
    const provinceCode = this.value;
    const districtSelect = document.getElementById("district");
    const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
    const data = await res.json();
    districtSelect.innerHTML = `<option value="">--Chọn Quận/Huyện--</option>`;
    data.districts.forEach(dist => {
        districtSelect.innerHTML += `<option value="${dist.code}">${dist.name}</option>`;
    });

    document.getElementById("ward").innerHTML = `<option value="">--Chọn Phường/Xã--</option>`;
});

document.getElementById("district").addEventListener("change", async function () {
    const districtCode = this.value;
    const wardSelect = document.getElementById("ward");
    const res = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
    const data = await res.json();
    wardSelect.innerHTML = `<option value="">--Chọn Phường/Xã--</option>`;
    data.wards.forEach(ward => {
        wardSelect.innerHTML += `<option value="${ward.name}">${ward.name}</option>`;
    });
});

fetchProvinces();