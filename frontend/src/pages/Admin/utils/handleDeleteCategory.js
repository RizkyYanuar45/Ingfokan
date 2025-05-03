const handleDeleteCategory = async (categoryId) => {
  const api = import.meta.env.VITE_API_URL;
  // Request hapus tanpa konfirmasi
  let response = await fetch(`${api}/category/delete/${categoryId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  let result = await response.json();

  if (result.message.includes("Peringatan")) {
    // Tampilkan dialog konfirmasi ke user
    const confirmDelete = window.confirm(
      `${result.message}\nApakah Anda yakin ingin melanjutkan?`
    );
    if (confirmDelete) {
      // Request hapus dengan konfirmasi
      response = await fetch(
        `${api}/category/delete/${categoryId}?confirm=true`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const finalResult = await response.json();
      alert(finalResult.message);
    } else {
      alert("Penghapusan dibatalkan");
    }
  } else {
    alert(result.message);
  }
};

export default handleDeleteCategory;
