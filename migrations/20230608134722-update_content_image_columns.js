"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("posts", "content", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("posts", "image", {
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("posts", "content", {
      type: Sequelize.TEXT,
      allowNull: false,
    });

    await queryInterface.changeColumn("posts", "image", {
      type: Sequelize.STRING,
    });
  },
};
