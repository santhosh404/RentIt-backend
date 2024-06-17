
export const convertToISO = (date) => {
    return new Date(date).toISOString();
}

export const isValidDate = (dateString) => {

    const date = new Date(dateString);
    
    // Check if the date is valid
    return date instanceof Date && !isNaN(date);
}