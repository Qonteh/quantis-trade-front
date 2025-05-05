
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Transaction = sequelize.define('Transaction', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM(
      'deposit', 
      'withdraw', 
      'transfer_in', 
      'transfer_out', 
      'platform_transfer_live', 
      'platform_transfer_demo'
    ),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending'
  },
  reference: {
    type: DataTypes.STRING
  },
  relatedUserId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  metadata: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('metadata');
      return value ? JSON.parse(value) : null;
    },
    set(value) {
      this.setDataValue('metadata', value ? JSON.stringify(value) : null);
    }
  }
}, {
  timestamps: true
});

module.exports = Transaction;
