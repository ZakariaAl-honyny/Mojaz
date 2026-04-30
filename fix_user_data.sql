UPDATE Users 
SET FullNameAr = N'زكريا الحنيني', 
    FullNameEn = 'Zakaria Al-Honyny', 
    Role = 5, 
    AppRole = 5 
WHERE Email = 'zkryaalhnyny5@gmail.com';

UPDATE Users 
SET FullNameAr = N'موظف أمن', 
    FullNameEn = 'Security Officer', 
    Role = 5, 
    AppRole = 5 
WHERE FullNameAr LIKE '%99%' OR NationalId LIKE '%99%';
GO
