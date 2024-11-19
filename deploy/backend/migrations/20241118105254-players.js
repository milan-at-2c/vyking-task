'use strict';

const { Sequelize } = require('sequelize');
const { Keypair } = require('@solana/web3.js');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable('Player', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      walletAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      walletPrivateKey: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      walletPublicKey: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });

    const playersArray = [];

    for (let i = 0; i < 10; i++) {
      const wallet = await Keypair.generate();
      playersArray.push({
        name: `Player ${i}`,
        walletAddress: wallet.publicKey.toBase58(),
        walletPublicKey: wallet.publicKey.toString(),
        walletPrivateKey: wallet.secretKey.toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('Player', playersArray);
  },

  async down (queryInterface) {
    await queryInterface.dropTable('Player');
  }
};
