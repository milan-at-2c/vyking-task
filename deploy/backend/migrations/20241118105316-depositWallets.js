'use strict';

const { Sequelize } = require('sequelize');
const { Keypair } = require('@solana/web3.js');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable('DepositWallet', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      walletAddress: {
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

    const wallet = await Keypair.generate();

    await queryInterface.bulkInsert('DepositWallet', [{
      walletAddress: wallet.publicKey.toBase58(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },

  async down (queryInterface) {
    await queryInterface.dropTable('DepositWallet');
  }
};
