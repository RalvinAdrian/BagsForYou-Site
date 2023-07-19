function queryAsync(query) {
    return new Promise((resolve, reject) => {
        pool.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

async function fetchBrandBagList() {
    try {
        const query = `
            SELECT merk.Nama_Merk AS brand, COUNT(*) AS count
            FROM tas t INNER JOIN merk ON t.Id_Merk = merk.Id_Merk
            GROUP BY merk.Nama_Merk
            ORDER BY count DESC;
        `;

        const results = await queryAsync(query);

        const brands = results.map((row) => row.brand);
        const bagCounts = results.map((row) => row.count);

        const topTenByCategory = await fetchTopTenBagsByCategory();
        const topTenBySubcategory = await fetchTopTenBagsBySubcategory();

        return {
            brands,
            bagCounts,
            topTenByCategory,
            topTenBySubcategory,
        };
    } catch (error) {
        throw error;
    }
}

async function fetchTotalBags() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) AS TotalBags FROM tas';

        pool.query(query, (error, results) => {
            if (error) {
                console.error(error);
                reject(error);
                return;
            }
            resolve(results[0].TotalBags);
        });
    })
}

async function fetchTotalCategories() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(Id_Kategori) AS TotalCategories FROM kategori';

        pool.query(query, (error, results) => {
            if (error) {
                console.error(error);
                reject(error);
                return;
            }
            resolve(results[0].TotalCategories);
        });
    })
}

async function fetchTotalDesigners() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) AS TotalDesigners FROM designer';

        pool.query(query, (error, results) => {
            if (error) {
                console.error(error);
                reject(error);
                return;
            }
            resolve(results[0].TotalDesigners);
        });
    })
}

async function fetchTotalReviews() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) AS TotalReviews FROM review';

        pool.query(query, (error, results) => {
            if (error) {
                console.error(error);
                reject(error);
                return;
            }
            resolve(results[0].TotalReviews);
        });
    })
}

async function fetchAverageReviewValue() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT AVG(Bintang) AS AverageReviewValue FROM review';

        pool.query(query, (error, results) => {
            if (error) {
                console.error(error);
                reject(error);
                return;
            }
            resolve(results[0].AverageReviewValue);
        });
    })
}

async function fetchLowestRating() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT MIN(Bintang) AS LowestRating FROM review';

        pool.query(query, (error, results) => {
            if (error) {
                console.error(error);
                reject(error);
                return;
            }
            resolve(results[0].LowestRating);
        });
    })
}

async function fetchTotalSubcategories() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) AS TotalSubcategories FROM sub_kategori';

        pool.query(query, (error, results) => {
            if (error) {
                console.error(error);
                reject(error);
                return;
            }
            resolve(results[0].TotalSubcategories);
        });
    })
}

async function fetchTotalAccounts() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(Id_Account) AS TotalAccounts FROM account';

        pool.query(query, (error, results) => {
            if (error) {
                console.error(error);
                reject(error);
                return;
            }
            resolve(results[0].TotalAccounts);
        });
    })
}

async function fetchFollowerCount() {
    return new Promise((resolve, reject) => {
        pool.query(
            'SELECT a.Username, COUNT(f.Id_Follower) AS FollowerCount FROM follow AS f INNER JOIN account AS a ON f.Id_Account = a.Id_Account GROUP BY f.Id_Account, a.Username',
            (error, results) => {
                if (error) {
                    console.error(error);
                    reject(error);
                    return;
                }
                const usernames = results.map((row) => row.Username);
                const followerCounts = results.map((row) => row.FollowerCount);
                resolve({ usernames, followerCounts });
            }
        );
    })
}

async function fetchTopTenBagsByCategory() {
    try {
        const query = `
            SELECT k.Nama_Kategori AS category, COUNT(r.Id_Review) AS count, AVG(r.Bintang) AS average_rating, SUM(r.Bintang) AS total_rating
            FROM review r
            INNER JOIN tas t ON r.Id_Tas = t.Id_Tas
            INNER JOIN sub_kategori s ON t.Id_Subkategori = s.Id_Subkategori
            INNER JOIN kategori k ON s.Id_Kategori = k.Id_Kategori
            GROUP BY k.Nama_Kategori
            ORDER BY total_rating DESC, count DESC
            LIMIT 10;
        `;

        const results = await queryAsync(query);

        const names = results.map((row) => row.category);
        const counts = results.map((row) => row.count);
        const ratings = results.map((row) => row.average_rating);

        return {
            names,
            counts,
            ratings,
        };
    } catch (error) {
        throw error;
    }
}
async function fetchTopTenBagsBySubcategory() {
    try {
        const query = `
            SELECT s.Nama_Subkategori AS subcategory, COUNT(r.Id_Review) AS count, AVG(r.Bintang) AS average_rating, SUM(r.Bintang) AS total_rating
            FROM review r
            INNER JOIN tas t ON r.Id_Tas = t.Id_Tas
            INNER JOIN sub_kategori s ON t.Id_Subkategori = s.Id_Subkategori
            GROUP BY s.Nama_Subkategori
            ORDER BY total_rating DESC, count DESC
            LIMIT 10;
        `;

        const results = await (query);

        const names = results.map((row) => row.subcategory);
        const counts = results.map((row) => row.count);
        const ratings = results.map((row) => row.average_rating);

        return {
            names,
            counts,
            ratings,
        };
    } catch (error) {
        throw error;
    }
}


export {
    fetchBrandBagList,
    fetchTotalBags,
    fetchTotalCategories,
    fetchTotalDesigners,
    fetchTotalReviews,
    fetchAverageReviewValue,
    fetchLowestRating,
    fetchTotalSubcategories,
    fetchTotalAccounts,
    fetchFollowerCount,
    fetchTopTenBagsByCategory,
    fetchTopTenBagsBySubcategory
};