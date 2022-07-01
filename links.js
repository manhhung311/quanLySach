const links = (req, role)=> {
    const protocol = req.protocol + "://";
    const host = protocol + req.get('host');
    let link = {};
    if(role) {
        link = {
            menu : {
                thongKe: host + '/thongke',
                banHang: host + '/banHang',
                nhapHang: host + '/nhapHang'
            },
            url:  {
                viewPhieuNhap: host + '/phieunhap/view',
                viewDauSach: host + '/dausach/view',
                viewHoaDon: host + '/hoadon/view',
                editPhieuNhap: host + '/phieunhap/edit',
                editDauSach: host + '/dausach/edit',
                editeditHoaDon: host + '/hoadon/edit',
                delPhieuNhap: host + '/phieunhap/delete',
                delDauSach: host + '/dausach/delete',
                delHoaDon: host + '/hoadon/delete',
                logout: host + '/logout',
                login: host + '/login'
            },
            form: {
                nhapHoaDon : host + '/phieunhap',
                loai: host + '/loai',
                sach: host +'/sach',
                nhaXuatBan: host +'/nhaxuatban'
            }
        }
    }
    return link;
}


module.exports = links;