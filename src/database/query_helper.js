/**
 * If not used ORM, then used this query helper of mysql2.
 */

const { mysql, pool } = require('../mysql_db.js');
const _ = require('lodash');

function setQueryBuilder(params, isUpdate = false, includeParams = []) {
    const setQuery = {
        isNoParams: false,
        query: [],
        params: []
    };

    if (isUpdate && includeParams && includeParams.length) {
        setQuery.isNoParams = _.entries(params).some(([key, value]) =>
            _.isObject(value)
                ? includeParams.some((v) => v === value.alias) ||
                  _.isNumber(value.value) ||
                  !!value.value
                : includeParams.some((v) => v === key) ||
                  _.isNumber(value) ||
                  !!value
        );
    } else {
        setQuery.isNoParams = _.values(params).some((value) =>
            _.isObject(value)
                ? _.isNumber(value.value) || !!value.value
                : _.isNumber(value) || !!value
        );
    }

    if (isUpdate) {
        _.entries(params).forEach(([key, value]) => {
            const paramValue = _.isObject(value) ? value.value : value;

            if (includeParams.some((v) => v === key) && paramValue === '') {
                setQuery.query.push(
                    `${
                        _.isObject(value) ? value.alias : _.snakeCase(key)
                    } = NULL`
                );
            } else if (_.isNumber(paramValue) || !!paramValue) {
                setQuery.query.push(
                    `${_.isObject(value) ? value.alias : _.snakeCase(key)} = ?`
                );
                setQuery.params.push(paramValue);
            }
        });
    } else {
        _.entries(params).forEach(([key, value]) => {
            const paramValue = _.isObject(value) ? value.value : value;

            if (_.isNumber(paramValue) || !!paramValue) {
                setQuery.query.push(
                    _.isObject(value) ? value.alias : _.snakeCase(key)
                );
                setQuery.params.push(paramValue);
            }
        });
    }

    return setQuery;
}

// mysql query result를 가져오기 위한 wrapper
async function queryResultGetter(query, params = [], connection) {
    return new Promise(async (resolve, reject) => {
        if (connection) {
            await connection
                .query(query, params)
                .then(([result]) => resolve(result))
                .catch((e) => reject(e));
        } else {
            const conn = await pool.getConnection();
            await conn
                .query(query, params)
                .then(([result]) => resolve(result))
                .catch((e) => reject(e));

            conn.release();
        }
    });
}

async function updateSetQueryGetter(updateSetQuery, pk, tableName, connection) {
    const updateSql = `
        UPDATE ${tableName}
        SET ${updateSetQuery.query.join(',')}
        WHERE id = ${mysql.escape(pk)}
    `;

    return await queryResultGetter(
        updateSql,
        updateSetQuery.params,
        connection
    );
}

async function insertSetQueryGetter(insertSetQuery, tableName, connection) {
    const insertSql = `
        INSERT INTO ${tableName} (${insertSetQuery.query.join(',')})
        VALUES (${insertSetQuery.params.map((v) => '?').join(',')})
    `;

    return await queryResultGetter(
        insertSql,
        insertSetQuery.params,
        connection
    );
}

async function upsertSetQueryGetter(
    upsertSetQuery,
    upsertParams,
    tableName,
    connection
) {
    const upsertSql = `
        INSERT INTO ${tableName} (${upsertSetQuery.query.join(',')})
        VALUES (${upsertSetQuery.params.map((v) => '?').join(',')})
        ON DUPLICATE KEY UPDATE
            ${_.entries(upsertParams)
                .filter(([key, value]) => _.isNumber(value) || !!value)
                .map(([key, value]) => `${_.snakeCase(key)} = '${value}'`)
                .join(',')}
    `;

    return await queryResultGetter(
        upsertSql,
        upsertSetQuery.params,
        connection
    );
}

module.exports = {
    setQueryBuilder,
    queryResultGetter,
    updateSetQueryGetter,
    insertSetQueryGetter,
    upsertSetQueryGetter
};
