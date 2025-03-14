"use strict";

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Articles", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      thumbnail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Categories", // Nama tabel yang direferensikan
          key: "id",
        },
        onUpdate: "CASCADE", // Opsi untuk memperbarui referensi
        onDelete: "SET NULL", // Opsi untuk menghapus referensi
      },
      author_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Authors", // Nama tabel yang direferensikan
          key: "id",
        },
        onUpdate: "CASCADE", // Opsi untuk memperbarui referensi
        onDelete: "SET NULL", // Opsi untuk menghapus referensi
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Articles");
  },
};
