import sequelize from "../config/database.js";
import user from "../models/user.js";

const seeder = async () => {
  try {
    await sequelize.sync({ force: true }); //ini agar bila ada tabel sebelumnya akan dihapus kemudian dibuatkan
    console.log("tabel direstart");
    await user.create({
      name: "Jane Doe",
      email: "jane.doe@example.com",
      password: "password123",
      role: "admin",
      username: "JD",
    });
    return console.log("berhasil seed ke database");
  } catch (error) {
    return console.log(error);
  }
};

seeder();
