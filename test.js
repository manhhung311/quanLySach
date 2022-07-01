var array = [1,2,4,3,5,3,2,12];
let i = 0;
console.log(array.length)
for(let i = 0; i < array.length ; i++) {
    console.log(array[i])
}
var number = [];
console.log(number.length)

// l1 i = 11
// l2 i = 9 false

<%dauSach.data.forEach(sp=> {%>
    <tr id="row[<%=sp.stt%>]">
        <td id="check[<%=sp.stt%>]">
            <label>
                <input onclick="editTable('<%=sp.stt%>')" class="checkbox1" type="checkbox" name="check[<%=sp.stt%>]" id="check[<%=sp.stt%>]" >
            </label>
        </td>
        <td>
            <%=sp.stt%>
        </td>
        <td>
            <%=sp.maSanPham%>
        </td>
        <td>
            <%=sp.tenSanPham%>
        </td>
        <td>
            <input type="number" onkeyup="tinhTien('<%=sp.stt%>','<%=sp.donGia%>')" name="soLuong[<%=sp.stt%>]" id="soLuong[<%=sp.stt%>]">
        </td>
        <td id="donGia[<%=sp.stt%>]">
            <%=sp.donGia%>
        </td>
        <td id="thanhTien[<%=sp.stt%>]">
            <!-- tính giá tiền theo số lượng -->
        </td>
        <td>
            <%=sp.nhaCungCap%>
        </td>
        <td>
            <%=sp.diaChi%>
        </td>
        <td>
            <%=sp.hoTen%>
        </td>
        <td>
            <P class="money">
                <%=sp.tonDauThangTruoc%>
            </P>
        </td>
        <td hidden></td>
        
        
    </tr>
    <%})%>
</form>
    <tr>
        <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td>
        <td id="tongTien">Thành Tiền: 10</td>
    </tr>
</tbody>