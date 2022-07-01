const data = (link)=> {
    let json = {}
    json["link"] = link; json["admin"] = true;
    json["canhBao"] = {};
    json["danhSachHoaChat"] = {data: [
        {   stt: 1,
            maSoPhieu: "123",
            tenSanPham: "Đô Rê Mon",
            soLuong: "12322",
            donGia: "199922",
            thanhTien: 123444,
            nhaCungCap: "hop",
            diaChi: 12,
            hoTen: "12/03/2021",
            ngayTao: "12/03/2021",
            xem: 3217312378,
            sua: "23",
            xoa: 22
        }
    ]};
    json["danhSachNhapKho"] = {
        data: [{ 
            stt: 1,
            maHoaChat: 123,
            tenHoaChat: "H2SO4",
            tenNhaThau: "CT TNHH",
            nuocSanXuat: "VN",
            soLo: "h2211",
            donViTinh: "hop",
            nhapTrongThang: 123332,
            donViDongGoi: 12333,
            soLuongDongGoi: 123,
            hanSuDung: "12/03/2021"
        }

    ]};
    json["danhSachTonKho"] = {data:[{
        stt: 1,
        maHoaChat: 123,
        tenHoaChat: "H2SO4",
        tenNhaThau: "CTY TNHH",
        nuocSanXuat: "VN",
        donViTinh: 1234,
        donViDongGoi: "hộp",
        soLuongDongGoi: 127722,
        soLuongDuTrongKho: 1223322,
        soLuongPhanCacPhong: 12342,
        soLuongSuDung: 12322,
        hanMucDuTru: 12322211 
    }]};
    json["danhSachDuTru"] = {
        data: [{
            stt: 1,
            maHoaChat: 123,
            tenHoaChat: "H2SO4",
            donViTinh: 1234,
            duTru: 12322211, 
            donViDongGoi: "hộp"
        }]
    };
    json["canhBao"] = {
        data: [{
            tenPhong: "hóa sinh",
            tenHoaChat: "H2SO4",
            soLo: "11223a",
            ngayHetHan: "23/03/2021",
            soLuong: 1234
        }]
    }

    json["phanKho"] = {
        data: [{
            maHoaChat: 123,
            tenHoaChat: "H2SO4",
            soLo: "hh2jj",
            donViTinh: "hộp",
            donViDongGoi: "test",
            hanSuDung: "23/03/1998",
            tonKho: 123,
            soLuongXuat: 0
            }],
        phong: [{tenPhong: "hóa sinh", maPhong: 3211}]
    }

    json["dauSach"] = {
        data: [{
            stt: 1,
            maSach: "1hhh1",
            tenSanPham: "Đắc Nhân Tâm",
            chungLoai: "truyện",
            soLuong: 11123,
            giaBan: 544333,
            tenTacGia:  "chưa biết"
        }]
    }

    json["hoaDon"] = {
        data: [{
            stt: 1,
            maHoaDon: "1hhh1",
            maSanPham: "34333d",
            tenSanPham: "Đắc Nhân Tâm",
            ngayBan: "02/01/2011",
            soLuong: 10,
            donGia: 3443,
            thanhTien: 21222,
        }]
    }

    json["phieuNhap"] = {
        data: [{
            stt: 1,
            maSoPhieu: "1hhh1",
            tenSanPham: "Đắc Nhân Tâm",
            soLuong: 5622,
            donGia: 11122333,
            nhaCungCap: "Tuổi Trẻ",
            diaChi: "Lĩnh Nam",
            hoTen: "Hưng",
            ngayTao: "12/12/2021",
            thanhTien: 34544543
        },
        {
            stt: 1,
            maSoPhieu: "1hhh1",
            tenSanPham: "Đắc Nhân Tâm",
            soLuong: 5622,
            donGia: 11122333,
            nhaCungCap: "Tuổi Trẻ",
            diaChi: "Lĩnh Nam",
            hoTen: "Hưng",
            ngayTao: "12/12/2021",
            thanhTien: 34544543
        },
        {
            stt: 1,
            maSoPhieu: "1hhh1",
            tenSanPham: "Đắc Nhân Tâm",
            soLuong: 5622,
            donGia: 11122333,
            nhaCungCap: "Tuổi Trẻ",
            diaChi: "Lĩnh Nam",
            hoTen: "Hưng",
            ngayTao: "12/12/2021",
            thanhTien: 34544543
        }]
    }
    json["sanPham"] = {
        data:[{
            stt: 1,
            maSanPham: "1hhh1",
            tenSanPham: "Đắc Nhân Tâm",
            soLuong: 5622,
            donGia: 11122333,
            nhaCungCap: "Tuổi Trẻ",
            diaChi: "Lĩnh Nam",
            hoTen: "Hưng"
        }, {
            stt: 2,
            maSanPham: "34ff",
            tenSanPham: "Nhân Tâm",
            soLuong: 5622,
            donGia: 11122333,
            nhaCungCap: "Tuổi Trẻ",
            diaChi: "Lĩnh Nam",
            hoTen: "Hưng"
        }]
    }
    console.log(json);
    return json
}

module.exports = {data: data};