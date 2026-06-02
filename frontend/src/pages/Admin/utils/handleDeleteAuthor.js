const handleDeleteAuthor = async (authorId) => {
  const api = import.meta.env.VITE_API_URL;
  // Request hapus tanpa konfirmasi
  let response = await fetch(`${api}/author/delete/${authorId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    credentials: "include",
  });
  let result = await response.json();

  if (response.ok) {
    // Jika berhasil, tampilkan notifikasi sukses
    return {
      type: "success",
      message: "Author deleted successfully!",
    };
  } else {
    // Jika gagal, tampilkan notifikasi error
    return {
      type: "error",
      message: result.message || "Failed to delete author.",
    };
  }
};

export default handleDeleteAuthor;
