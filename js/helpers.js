// Given an age value, convert it to an int [1-6] representing the appropriate
// age range.
function convertAverageAgeToRange(averageAge) {
	let ageInput;
	if(averageAge <= 24) ageInput = 1;
	else if(averageAge <= 34) ageInput = 2;
	else if(averageAge <= 44) ageInput = 3;
	else if(averageAge <= 54) ageInput = 4;
	else if(averageAge <= 64) ageInput = 5;
	else ageInput = 6;
	return ageInput;
}

// Given a household income value, convert it to an int [0-24] representing
// the appropriate income range.
function convertHouseholdIncomeToRange(householdIncome) {
	let householdIncomeInput;
	if(householdIncome < 10000) householdIncomeInput = 0;
	else if(householdIncome <= 14999) householdIncomeInput = 1;
	else if(householdIncome <= 19999) householdIncomeInput = 2;
	else if(householdIncome <= 24999) householdIncomeInput = 3;
	else if(householdIncome <= 29999) householdIncomeInput = 4;
	else if(householdIncome <= 34999) householdIncomeInput = 5;
	else if(householdIncome <= 39999) householdIncomeInput = 6;
	else if(householdIncome <= 44999) householdIncomeInput = 7;
	else if(householdIncome <= 49999) householdIncomeInput = 8;
	else if(householdIncome <= 54999) householdIncomeInput = 9;
	else if(householdIncome <= 59999) householdIncomeInput = 10;
	else if(householdIncome <= 64999) householdIncomeInput = 11;
	else if(householdIncome <= 69999) householdIncomeInput = 12;
	else if(householdIncome <= 74999) householdIncomeInput = 13;
	else if(householdIncome <= 79999) householdIncomeInput = 14;
	else if(householdIncome <= 84999) householdIncomeInput = 15;
	else if(householdIncome <= 89999) householdIncomeInput = 16;
	else if(householdIncome <= 94999) householdIncomeInput = 17;
	else if(householdIncome <= 99999) householdIncomeInput = 18;
	else if(householdIncome <= 109999) householdIncomeInput = 19;
	else if(householdIncome <= 119999) householdIncomeInput = 20;
	else if(householdIncome <= 129999) householdIncomeInput = 21;
	else if(householdIncome <= 139999) householdIncomeInput = 22;
	else if(householdIncome <= 144999) householdIncomeInput = 23;
	else householdIncomeInput = 24;
	return householdIncomeInput;
}