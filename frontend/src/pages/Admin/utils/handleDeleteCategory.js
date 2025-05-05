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

  if (response.ok) {
    // Jika berhasil, tampilkan notifikasi sukses
    return {
      type: "success",
      message: "Category deleted successfully!",
    };
  } else {
    // Jika gagal, tampilkan notifikasi error
    return {
      type: "error",
      message: result.message || "Failed to delete category.",
    };
  }
};

export default handleDeleteCategory;
