// khai báo thư viện express
const express = require("express");
const app = express();

//gọi đến links.js chứa hàm xử lý trả về các đường dẫn cần thiết cho menu form,....
let links = require('./links');

// khai báo thư viện mysql để sử dụng kết nối và xử lý đến database
const mysql = require('mysql');

// sử dụng thư viện dotenv để đọc file .env chứa các thông tin về host server, host database, ....
require("dotenv").config();

// khai báo bodyPaser dùng để đọc các dữ liệu gửi lên dạng body
const bodyparser = require('body-parser');
var urlencodedParser = bodyparser.urlencoded({ extended: false });


// khởi tạo cấu hình kết nối đến mysql
const connection = mysql.createConnection({
    host: process.env.DB_HOST, // process.env.DB_HOST: đọc DB_HOST trong .env tác dụng là lấy cấu hình host database
    port: process.env.DB_PORT, //// process.env.DB_PORT: đọc DB_PORT trong .env tác dụng là lấy cấu hình port đatabase
    database: process.env.DB_DATABASE, //// process.env.DB_DATABASE: đọc DB_DATABASE trong .env tác dụng là lấy tên database
    user: process.env.DB_USER, //// process.env.DB_USER: đọc DB_USER trong .env tác dụng là lấy cấu hình user database
    password: process.env.DB_PASSWORD //// process.env.DB_PASSWORD: đọc DB_PASSWORD trong .env tác dụng là lấy cấu hình password database

})

// mở kết nối đến mysql
connection.connect();


// công khai thư mục public chứa các file js css
app.use('/', express.static('./public'));

// sử dụng ejs để quản lý view (font - end)
app.set('view engine', 'ejs');


// kiểm tra xem id có thuộc account ko 
var ckeckIdAccount = (id) => {
     // sử dụng cơ chế promise để trả về kết quả resolve khi thực hiện đươc còn reject khi không thực hiện được
    let promise = new Promise((resolve, reject) => {
        // câu lệnh sql chọn tất cả trong bảng account với điều kiện id = id được truyền vào
        let sql = `select * from account where id = '` + id + `'`;
        // thực thi truy vấn
        connection.query(sql, (err, result) => {
            // nếu có kết quả trả về đúng
            if (result[0]) {

                resolve(true)
            }
            else { // không có kết quả trả về sai
                reject(false)
            }
        })
    })
    return promise

}

// hàm kiểm tra trạng thái đăng nhập
var checkLogin = (req, res, next) => {

    // lấy cookie từ người dùng gửi lên
    let id = req.get('cookie')
    if (id) {

        // tách lấy id account từ cookie
        id = id.split('=')[1] || null;
        
        // chạy hàm kiểm tra cookie
        // nếu đúng cho đi qua các đường dẫn khác
        if (ckeckIdAccount(id)) {
            // cho phép đi qua tuyến đường hiện tại
            next();
        
        }

        // khi cookie sai đẩy lại trang login ko cho qua trang khác
        else {
            // điều hướng lại về trang login
            res.redirect('/login')
        }
    }
    // không có cookie thì đẩy lại trang login
    else {
        // điều hướng lại về trang login
        res.redirect('/login')
    }
}




//giao diện để đăng nhập
app.get('/login', (req, res) => {

    // lấy các đường dẫn được quy ước để gán vào trang web qua file links.js đã được add ở trên
    let link = links(req, true);
    let json = {}
    // tạo ra chuỗi json name là link
    json["link"] = link;

    // lấy cookie được gửi lên
    let id = req.get('cookie')

    // nkiểm tra xem có cookie ko 
    if (id) {

        // tách lấy id account trên cookie
        id = id.split('=')[1] || null;

        // kiểm tra id account có tồn tại không nếu có điều hướng về trang chủ sai thì đẩy về giao diện login
        if (ckeckIdAccount(id)) {

            // điều hướng đến trang home
            res.redirect('/home')

        }
        else {

            // điều hướng đến trang login
            res.render('login', json)

        }
    }
    else {
        // khi không có cookie sẽ đẩy ra trang login
        res.render('login', json)
    }

})


// chức năng đăng nhập
var login = (user, password) => {

    // câu truy vấn sql lấy ra tài khoản có user và password giống như user và password truyền vào
    let sql = `select * from account where user = '` + user + `' and password = '` + password + `'`;
    // sử dụng cơ chế promise để trả về kết quả resolve khi thực hiện đươc còn reject khi không thực hiện được

    let promise = new Promise((resolve, reject) => {
        // thực thi truy vấn 
        connection.query(sql, (err, result) => {

            //khi có kết quả truy vấn đồng nghĩa đúng => tài khoản nhập vào đúng
            if (result[0]) {

                resolve({ result: true, id: result[0].id, name: result[0].name });

            }
            else {

                resolve(false);

            }

        })
    })


    return promise
}


// dữ liệu được gửi dưới đạng post để login 
app.post('/login', urlencodedParser, async (req, res) => {

    // lấy ra giá trị của thẻ có name = user được truyền từ body
    let user = req.body.user;

    // lấy ra giá trị của thẻ có name = password được truyền từ body
    let password = req.body.password; 

    // tạo biến check sử dụng chức năng đăng nhập bên trên
    let check = await login(user, password) 

    // nếu chức năng đăng nhập trả về là đúng gửi một cookie idUser = id (id tương ứng với id của account trong csdl)
    if (check.result) {

        // gửi cookie idUser để kiểm tra đăng nhập
        res.cookie('idUser', check.id);

        // gửi cookie name để lấy name 
        res.cookie('name', check.name)
        
        // điều hướng đến thongke
        res.redirect('/thongke')

    }

    // khi đăng nhập sai điều hướng về đường dẫn login
    else { 
        // điều hướng về trang login
        res.redirect('/login')

    }
})

//mọi đường dẫn đều phải đi qua chức năng kiểm tra đăng nhập
app.use(checkLogin);


// vào trang web sẽ điều hướng tới login và từ login nếu đã đăng nhập sẽ được điều hướng về home
app.get('/', (req, res) => {
    res.redirect('/login')
})
/**
 * OK
 */



// đổ dữ liệu trang home
var getData = () => {
     // sử dụng cơ chế promise để trả về kết quả resolve khi thực hiện đươc còn reject khi không thực hiện được
    var promise = new Promise((resolve, reject) => {
        // câu truy vấn lấy ra bảng ghép nối các bảng sách với loại và nhà xuất bản, phiếu nhập
        let sql = `select phieu_nhap.id as id, phieu_nhap.ngay_nhap, phieu_nhap.so_luong,phieu_nhap.don_gia
        ,phieu_nhap.ma_phieu_nhap,sach.ten_tac_gia, sach.ten_sach, nha_xuat_ban.ten_nxb,nha_xuat_ban.dia_chi
        from sach inner join phieu_nhap on sach.id = phieu_nhap.sach_id
        inner join loai on loai.id = sach.loai_id inner join nha_xuat_ban on nha_xuat_ban.id = sach.nha_xuat_ban_id`;

        //câu truy vấn lấy bảng hóa đơn ghép nối với sách
        let sqlHD = `select hoa_don.id as id, sach.ma_sach as ma_sach,
        sach.ten_sach as ten_sach, hoa_don.ngay_lap as ngay_lap,
        hoa_don.so_luong as so_luong, sach.gia_ban as gia_ban  from hoa_don inner join sach on hoa_don.sach_id = sach.id`

        // câu truy vấn lấy ra bảng sách ghép nối với loại cùng nhà xuất bản
        let sqlDS = `select sach.id, sach.ma_sach, sach.ten_sach, sach.gia_ban, sach.ten_tac_gia, loai.ten_loai  from sach inner join loai on loai.id = sach.loai_id inner join nha_xuat_ban on sach.nha_xuat_ban_id =  nha_xuat_ban.id`;
        // biến data được tạo ra nhằm lưu trữ giá trị của data
        var data = {}
        // thực hiện truy vấn cho câu sql
        connection.query(sql, (err, result) => {
            // khi không có lỗi xảy ra
            if (!err) {

                //thêm vào chuỗi json phieuNhap
                data["phieuNhap"] = {
                    data: result
                }
                // thực hiện truy vấn cho câu sqlDS
                connection.query(sqlDS, (errDS, resultDS) => {
                    // nêu không có lỗi truy vấn
                    if (!errDS) {

                        //thêm vào chuỗi json dauSach
                        data["dauSach"] = {
                            data: resultDS
                        }
                        // thực hiện truy vấn cho câu sqlHD
                        connection.query(sqlHD, (errHD, resultHD) => {

                            if (!errHD) {

                                //thêm vào chuỗi json hoaDon
                                data["hoaDon"] = {
                                    data: resultHD
                                }
                                resolve(data);
                            }
                        })
                    }
                })
            }
            else {

                //khi có lỗi xảy ra 
                reject(data)
            }
        })
    })
    return promise;
}








/**
 *
 * mọi chức năng từ đây xuống dưới
 * đều phải đăng nhập mới sử dụng được
 */



/**
 * Trang Home 
 * trang đầu tiên được mở khi đăng nhập thành công
 * có chức năng chủ yếu hiện danh sách thống kê
 */
app.get('/home', async (req, res) => {

    // gọi hàm getData() để lấy ra các thông tin cần thiết cho trang home
    var data = await getData();
    let link = links(req, true);
    
    //chèn thêm link vào chuỗi json
    data["link"] = link;

    data["status"] = {
        home: false,
        delete: true
    }

    // render ra trang home với chuỗi json data
    res.render('home', data)
})


/**
 * chức năng con của trang home
 * hiện view của phiếu nhập
 */
app.get('/phieunhap/view/:id', (req, res) => {
    let link = links(req, true);
    let data = {};
    data["link"] = link;

    // lấy ra id được truyền theo url
    let id = req.params.id;

    let sql = `select * from phieu_nhap inner join sach on phieu_nhap.sach_id = sach.id
    inner join loai on sach.loai_id = loai.id inner join nha_xuat_ban 
    on nha_xuat_ban.id = sach.nha_xuat_ban_id
    where phieu_nhap.id = ` + `'` + id + `' `
    connection.query(sql, (err, result) => {
        data["phieuNhap"] =  {
            data: result
        };
       
        res.render('viewPhieuNhap', data)
    })
})



app.get('/dausach/view/:id', (req, res) => {

    let link = links(req, true);
    let data = {};

    data["link"] = link;
    let id = req.params.id;

    var sql = `select * from sach inner join loai on loai.id = sach.loai_id 
    inner join nha_xuat_ban on nha_xuat_ban.id = sach.nha_xuat_ban_id 
    where sach.id = '` + id + `'`;

    var sqlPN = `select * from phieu_nhap where sach_id = '` +id+`'`;

    connection.query(sql, (err, result) => {

        connection.query(sqlPN, (error, resultPN)=> {

            data["dauSach"] = {
                data: result
            }
            data["phieuNhap"] = {
                data: resultPN
            }
            res.render('viewSach', data)
        })

    })
})

app.get('/hoadon/view/:id', (req, res) => {

    let link = links(req, true);
    let data = {}
    data["link"] = link;
    let id = req.params.id;

    var sql = `select * from hoa_don inner join sach on hoa_don.sach_id = sach.id 
    inner join loai on loai.id = sach.loai_id
    inner join nha_xuat_ban on sach.nha_xuat_ban_id = nha_xuat_ban.id
    where hoa_don.id = `+ `'` + id + `' `;

    connection.query(sql, (err, result) => {

        data["hoaDon"] = {
            data: result
        }
        res.render('viewHoaDon', data)

    })
})

/**
 * chức năng cho phép chỉnh sửa một số thông tin của phiếu nhập
 * không cho phép chỉnh sửa giá nhập
 */
app.post('/phieunhap/edit/:id', urlencodedParser, (req, res) => {

    let link = links(req, true);
    link["link"] = link;

    //lấy ra id từ url
    let id = req.params.id;

    // lấy giá trị thẻ có name là sach trong html
    let sach = req.body.sach;
    let soLuong = req.body.soLuong;
    let giaNhap = req.body.giaNhap;

    let sql = `update phieu_nhap SET don_gia = '` + giaNhap + `
    ', so_luong = '` + soLuong + `', sach_id = '` + sach + `'
     WHERE id = '` + id + `'`;
    connection.query(sql, (err, result) => {
        res.redirect('/phieunhap/edit/' + id)
    })
})

app.get('/phieunhap/edit/:id', (req, res) => {
    let link = links(req, true);

    //lấy ra id từ url
    let id = req.params.id;

    // lấy ra toàn bộ sách
    let sql = `select * from sach`;
    let data = {}
    data["link"] = link;

    //lấy ra phiếu nhập có id được truyền từ đường dẫn
    let sqlPN = `select * from phieu_nhap where id = '` + id + `'`;
    connection.query(sql, (err, result) => {

        data["sach"] = {
            data: result
        }

        connection.query(sqlPN, (error, result1) => {

            data["phieuNhap"] = {
                data: result1
            }
            res.render('editPhieuNhap', data)
        })
    })
})




/**
 * Hàm kiểm tra xem sách có được thay đổi giá ko
 * hàm trả về giá trị true false
 */
var isEditGia = (id) => {

    //lấy toàn bộ thông tin hóa đơn có id
    let sql = `select * from hoa_don where sach_id = '` + id + `'`;

    let promise = new Promise((resolve, reject) => {

        connection.query(sql, (error, result) => {

            if (result[0]) {
                resolve(false);
            }
            else if (!error) {
                resolve(true);
            }
            else {
                reject(false);
            }

        })
    })
    return promise;
}


/**
 *  hiển thị giao diện cho việc edit 1 đầu sách
 *  
 */
app.get('/dausach/edit/:id', async (req, res) => {

    //lấy ra id từ url
    let id = req.params.id;

    //biến lưu trữ giá trị trả về của hàm kiểm tra
    let check = await isEditGia(id);

    //lấy ra các thông tin cần thiết của 1 cuấn sách
    let data = await getDataCreateSach();
    let link = links(req, true);
    data["link"] = link;
    data["check"] = { result: check };

    //lấy ra toàn bộ thông tin sách có id
    let sql = `select * from sach where id = '` + id + `'`;
    connection.query(sql, (err, result) => {

        data["dauSach"] = {
            data: result
        };

        //render ra html từ file editDauSach 
        res.render('editDauSach', data)
    })
})

/**
 * Trang tiếp nhận các thông tin để chỉnh sửa 1 đầu sách
 */
app.post('/dausach/edit/:id', urlencodedParser, async (req, res) => {

    //lấy ra các thông tin được gửi lên qua body
    let maSanPham = req.body.maSanPham;
    let tenSanPham = req.body.tenSanPham;
    let giaBan = req.body.giaBan;
    let nxb = req.body.nxb;
    let chungLoai = req.body.chungLoai;
    let tenTacGia = req.body.tenTacGia;

    // lấy id từ url
    let id = req.params.id;
    let sql;

    // kiểm tra xem có giá bán ko do 1 số giá bán ko đk phép chỉnh sửa
    if (giaBan) {

        sql = `update sach set ma_sach = '` + maSanPham + `', ten_sach = '` + tenSanPham + `',
         ten_tac_gia = '`+ tenTacGia + `', nha_xuat_ban_id = '` + nxb + `', loai_id = '` +
        chungLoai + `', gia_ban = '` + giaBan + `' where
         id = '` + id + `'`;
    }
    else {

        sql = `update sach set ma_sach = '` + maSanPham + `', ten_sach = '` + tenSanPham + `',
         ten_tac_gia = '`+ tenTacGia + `', nha_xuat_ban_id = '` + nxb + `', loai_id = '` + chungLoai + `' where
         id = '` + id + `'`;
    }

    // Thực hiện truy vấn
    connection.query(sql, (err, result) => {
        res.redirect('/dausach/edit/' + id);
    })

})





/**
 * Hàm thực hiện chức năng kiểm tra xem phiếu nhập lỗi có được phép xóa ko
 * trả về giá trị là true hoặc false
 */
var isDeletePhieuNhap = (id) => {

    let promise = new Promise((resolve, reject) => {

        // kết nối các bảng sách , phiếu nhập , hóa đơn lại làm 1 bảng
        let sql = `select * from phieu_nhap inner join sach on  phieu_nhap.sach_id = sach.id
        inner join hoa_don on sach.id = hoa_don.sach_id
        where phieu_nhap.id = '` + id + `'`;
        connection.query(sql, (err, result) => {

            if (result[0]) {
                resolve(false);
            }
            else if (!err) {
                resolve(true);
            }
            else {
                reject(false)
            }

        })
    })
    return promise;
}


/**
 * Hiển thị giao diện sau khi delete phiếu nhập
 */
app.get('/phieunhap/delete/:id', async (req, res) => {

    let link = links(req, true);
    link["link"] = link;
    let id = req.params.id;

    // dùng hàm để ktra xem được phép xóa ko 
    let check = await isDeletePhieuNhap(id);

    if (check) {

        // xóa phiếu nhập có id
        let sql = `DELETE FROM phieu_nhap WHERE id = '` + id + `'`;

        connection.query(sql, async (err, result) => {

            if (result[0]) {
                let data = await getData();
                data["link"] = link;
                data["status"] = {
                    home: true,
                    delete: true
                }
                res.render('home', data)
            }
            else {
                var data = await getData();
                data["link"] = link;
                data["status"] = {
                    home: true,
                    delete: false
                }
                res.render('home', data)
            }
        })
    }
    else {
        var data = await getData();

        data["link"] = link;
        data["status"] = {
            home: true,
            delete: true,
            edit: false,
            error: true
        }
        res.render('home', data)
    }
})


/**
 * Chức năng kiểm tra xem có được delete đầu sách không
 * hàm trả về kết quả là false nếu tìm thấy
 * ngược lại true nếu ko tìm thấy
 */
var isDeleteDauSach = (id) => {

    let promise = new Promise((resolve, reject) => {

        // kết nối bảng hóa đơn và bảng sách
        let sql = `select * from sach inner join hoa_don on hoa_don.sach_id = sach.id
        where sach.id = ` + `'` + id + `' `;
        connection.query(sql, (err, result) => {
            if (result[0]) {
                resolve(false);
            }
            else if (!err) {
                resolve(true);
            }
            else {
                reject(false)
            }
        })
    })
    return promise;
}


/**
 * hiển thị giao diện sau khi delete đầu sách
 */
app.get('/dausach/delete/:id', async (req, res) => {

    let id = req.params.id;
    let check = await isDeleteDauSach(id)

    if (check) {

        let sql = `DELETE FROM sach WHERE id = '` + id + `'`;

        connection.query(sql, async (err, result) => {

            var data = await getData();
            let link = links(req, true);
            data["link"] = link;
            if (result) {

                data["status"] = {
                    home: true,
                    delete: true
                }
                res.render('home', data)
            }
            else {

                var data = await getData();
                data["link"] = link;
                data["status"] = {
                    home: true,
                    delete: false
                }
                res.render('home', data)
            }
        })
    }
    else {

        var data = await getData();
        let link = links(req, true);
        data["link"] = link;
        data["status"] = {
            home: false,
            delete: false,
            edit: false,
            error: true
        }
        res.render('home', data)
    }
})

/**
 * hết home
 */


/**
 * hiển thị giao diện để bán hàng
 */
app.get('/banhang', async (req, res) => {

    //lấy ra trường dữ liệu cần thiết về thông tin hàng
    var data = await getData();
    let link = links(req, true);
    data["link"] = link;
    let json = {};
    let sql = `select sach.id as idSach, sach.ma_sach as maSach, sach.ten_sach as tenSanPham,
    loai.ten_loai as chungLoai, sach.sl as soLuong,
    sach.gia_ban as giaBan, sach.ten_tac_gia as tenTacGia,
    nha_xuat_ban.dia_chi as diaChi,
    nha_xuat_ban.ten_nxb as nhaCungCap from sach inner join loai on sach.loai_id = loai.id
    inner join nha_xuat_ban on nha_xuat_ban.id = sach.nha_xuat_ban_id `
    connection.query(sql, (err, result) => {

        json["dauSach"] = {
            data: result
        }
        let id = req.get('cookie')
        
        // tách cookie chứa tên người dùng để chèn vào trang bán hàng
        let name = decodeURI(id.split(' ')[1].split('=')[1]);

        json["link"] = link;
        json["name"] = name;
        res.render('banSach', json)
    })

})


/**
 * tiếp nhận thông tin xử lý bán hàng
 * khi yêu cầu thành công thì trả về ok cho người dùng
 * được load = ajax lên cần điều hướng , ....
 */
app.post('/banhang', urlencodedParser, (req, res) => {

    let soLuong = req.body.soLuong;
    let id = req.body.id;
    let soLuongCu = req.body.soLuongCu;
    let sql = `update sach set sl = '` + (soLuongCu - soLuong) + `' where
    id = '` + id + `'`;
    connection.query(sql, (err, result) => {

        sql = `insert into hoa_don (ngay_lap, so_luong, sach_id) values ('
        ` + new Date().toLocaleDateString('en-CA') + `','` + soLuong + `','` + id + `')`
        connection.query(sql, (error, result1) => {

            res.send("OK");
        })
    })
})


/**
 * hiển thị giao diện nhập hàng
 */
app.get('/nhaphang', (req, res) => {
    let link = links(req, true);
    link["link"] = link;
    res.render('nhapHang', link)
})


/**
 * điều hướng về home khi vào trang thống kê
 */
app.get('/thongke', (req, res) => {
    res.redirect('/home')
})


/**
 * Chức năng lấy thông tin về loại và nhà xuất bản
 */
var getDataCreateSach = () => {

    var promise = new Promise((resolve, reject) => {

        let sqlLoai = `select * from loai`;
        let sqlNXB = `select * from nha_xuat_ban`

        var data = {}

        connection.query(sqlLoai, (err, result) => {

            if (!err) {

                data["loai"] = {
                    data: result
                }
                connection.query(sqlNXB, (errDS, resultNXB) => {
                    if (!errDS) {
                        data["nxb"] = {
                            data: resultNXB
                        }

                        resolve(data)


                    }
                })
            }
            else {

                reject(data)
            }
        })
    })
    return promise;
}

/**
 * hiển thị giao diện liên quan đến sach
 * thêm sửa xóa
 */
app.get('/sach', async (req, res) => {
    let data = await getDataCreateSach();
    let link = links(req, true);
    data["link"] = link;
    res.render('sach', data)
})


/**
 * Tiếp nhận xử lý yêu cầu tạo 1 cuốn sách mới
 * 
 */
app.post('/sach', urlencodedParser, async (req, res) => {

    let maSanPham = req.body.maSanPham;
    let tenSanPham = req.body.tenSanPham;
    let giaBan = req.body.giaBan;
    let nxb = req.body.nxb;
    let chungLoai = req.body.chungLoai;
    let tenTacGia = req.body.tenTacGia;

    let sqlSach = `insert into sach (ma_sach, ten_sach, gia_ban,
    ten_tac_gia, nha_xuat_ban_id, loai_id) values
    ('` + maSanPham + `','` + tenSanPham + `','` + giaBan + `','`
    + tenTacGia + `','` + nxb + `','` + chungLoai + `')`

    connection.query(sqlSach, (err, result) => {

        if (result) {
            res.redirect('/sach');
        }
        else if (err) {
            res.send('có lỗi xảy ra')
        }
    })

})

/**
 * hiển thị giao diện thao tác phiếu nhập
 * 
 */
app.get('/phieunhap', (req, res) => {

    let sql = `select * from sach`;
    let data = {}

    connection.query(sql, (err, result) => {

        data["sach"] = {
            data: result
        }
        let link = links(req, true);
        data["link"] = link;
        res.render('phieunhap', data)

    })
})


/**
 * Tiếp nhận xử lý tạo phiếu nhập mới
 */
app.post('/phieunhap', urlencodedParser, (req, res) => {

    let soLuong = req.body.soLuong;
    let ngayTao = req.body.ngayTao;
    let maHoaDon = req.body.maHoaDon;
    let sach = req.body.sach;
    let giaBan = req.body.giaBan;

    let sql = `insert into phieu_nhap (ma_phieu_nhap, ngay_nhap,
    so_luong, don_gia, sach_id) values ('` + maHoaDon + `','` + ngayTao + `','`
    + soLuong + `','` + giaBan + `','` + sach + `')`

    connection.query(sql, (err, result) => {

        res.redirect('/phieunhap')
    })
})





/**
 * hiện trang thêm sửa thể loại và danh sách thể loại đã được tạo
 */
app.get('/loai', (req, res) => {

    let link = links(req, true);
    link["link"] = link;
    let sql = `select * from loai`

    connection.query(sql, (err, result) => {

        link["loai"] = result;
        res.render('loai', link)
    })
})


/**
 * Chức năng thêm 1 thể loại mới
 * hàm trả về true khi tạo thành công
 * false nếu ngược lại
 */
var addLoai = (tenLoai) => {

    let promise = new Promise((resolve, reject) => {

        let sql = `insert into loai (ten_loai) values ('` + tenLoai + `')`;

        connection.query(sql, (err, result) => {

            if (result) {

                resolve(true)
            }
            else if (!err) {

                resolve(false)
            }
            else {

                reject(false)
            }
        })
    })

    return promise;
}

/**
 * Tiếp nhận yêu cầu khi cần thêm một thể loại mới
 */
app.post('/loai', urlencodedParser, async (req, res) => {

    let tenLoai = req.body.tenLoai;
    let link = links(req, true);
    link["link"] = link;
    let check = await addLoai(tenLoai);
    check;

    res.redirect('/loai')
})




/**
 * Chức năng sửa thể loại 
 * trả về true nếu sửa được
 * ngượ lại false
 */
var editLoai = (id, name) => {

    let sql = `update loai set ten_loai = '` + name + `' where id = '` + id + `'`;

    let promise = new Promise((resolve, reject) => {

        connection.query(sql, (err, result) => {

            if (result) {

                resolve(true);
            }
            else if (!err) {

                resolve(false);
            }
            else {

                reject(false)
            }
        })
    })

    return promise;
}


/**
 * tiếp nhận yêu cầu delete loại
 */
app.post('/loai/delete/:id', (req, res) => {

    let id = req.params.id;
    let sql = `DELETE FROM loai WHERE id = '` + id + `'`

    connection.query(sql, (err, result) => {

        res.redirect('/loai')
    })
})


/**
 * Tiếp nhận yêu cầu sửa loại
 */
app.post('/loai/edit/:id', urlencodedParser, async (req, res) => {

    let id = req.params.id;
    let name = req.body.tenLoai;
    let check = await editLoai(id, name);
    check;
    res.redirect('/loai');

})


/**
 * hiển thị giao diện liên quan đến nhà xuất bản
 * thêm, sửa, xóa
 */
app.get('/nhaxuatban', (req, res) => {

    let link = links(req, true);
    link["link"] = link;
    let sql = `select * from nha_xuat_ban`

    let sql2 = `select * from loai`

    connection.query(sql, (err, result) => {

        connection.query(sql2, (error, result1) => {

            link["nhaXuatBan"] = result;
            link["loai"] = result1;
            res.render('nhaXuatBan', link)
        })
    })
})


/**
 * tiếp nhận yêu cầu tạo một nhà xuất bản mới
 */
app.post('/nhaxuatban', urlencodedParser, (req, res) => {

    let ma = req.body.ma;
    let ten = req.body.ten;
    let diaChi = req.body.diaChi;
    let sdt = req.body.sdt;
    let maTaiKhoan = req.body.maTaiKhoan;

    let sql = `insert into nha_xuat_ban (ma_nxb, ten_nxb,
    dia_chi, sdt, ma_tk) values ('` + ma + `','` + ten + `','`
    + diaChi + `','` + sdt + `','` + maTaiKhoan + `')`;

    connection.query(sql, (err, result) => {

        res.redirect('/nhaxuatban')
    })
})

/**
 * tiếp nhận yêu cầu sửa thông tin nhà xuất bản
 */
app.post('/nhaxuatban/:id', urlencodedParser, (req, res) => {

    let ma = req.body.ma;
    let ten = req.body.ten;
    let diaChi = req.body.diaChi;
    let sdt = req.body.sdt;
    let maTaiKhoan = req.body.maTaiKhoan;

    let id = req.params.id

    let sql = `update nha_xuat_ban set ma_nxb = '`
    + ma + `', ten_nxb = '` + ten + `',  dia_chi = '`
    + diaChi + `', sdt = '` + sdt + `', ma_tk = '` 
    + maTaiKhoan + `' where id = '` + id + `'`;

    connection.query(sql, (err, result) => {

        res.redirect('/nhaxuatban')
    })
})


/**
 * Tiếp nhận yêu cầu xóa nhà xuất bản
 */
app.post('/nhaxuatban/delete/:id', (req, res) => {

    let id = req.params.id

    let sql = `delete from nha_xuat_ban where id = '` + id + `'`;

    connection.query(sql, (err, result) => {

        res.redirect('/nhaxuatban')
    })
})
/**
 * đăng xuất tài khoản
 */
app.get('/logout', (req, res) => {

    //xóa cookie đã gửi cho người dùng
    res.clearCookie("idUser")
    res.clearCookie("name")

    // điều hướng về trang login
    res.redirect('/login')
})
/**
 * kết thúc đăng xuất
 */





/**
 * kết nối lắng nghe cổng SERVER_PORT được lưu trong file .env 
 */

// lấy tên cổng được định nghĩa trong file env
const port = process.env.SERVER_PORT

app.listen(port, (err) => {
    // kiểm tra xem có lỗi phát sinh khi mở cổng không
    if (!err) {
        console.log("connect server on port " + port);
    }
})

