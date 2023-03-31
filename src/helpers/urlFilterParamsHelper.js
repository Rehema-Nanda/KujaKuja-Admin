import moment from "moment";

// returns an object containing the URL query params
// - does not change their type (everything's a string)
// - allows multiple, digit param values for a single param key to be comma-separated
//   (rather than adhering to the 'standard' pattern where the param key is repeated, eg: ?longParamName=1&longParamName=2)
// **NB: digit params are always returned as an integer
export const getQueryParamsFromUrl = (query) => {
    const searchQuery = query || window.location.search;
    const searchParams = new URLSearchParams(searchQuery);

    const params = {};

    for (const p of searchParams) { // eslint-disable-line no-unused-vars
        const key = p[0];
        let val = p[1];

        if (val.search(/^\d+$/) === 0) {
            val = parseInt(val, 10);
        }
        else if (val.search(/^\d+(,\d+)*$/) === 0) {
            val = val.split(",");
        }
        params[key] = val;
    }

    return params;
};

export const remapQueryParamsToGlobalFilterStateVariableNames = (queryParams) => {
    // this function renames query param names, on the left, to the equivalent state variable names, on the right
    // *note that some state variable names are repeated - this is because the query param names come from API
    // endpoint param names, and these are not always consistent
    const map = {
        countries: "selectedCountries",
        settlements: "selectedLocations",
        service_types: "selectedServiceTypes", // *
        types: "selectedServiceTypes", // *
        points: "selectedServicePoints",
        users: "selectedUsers",
        start: "dateStart",
        end: "dateEnd",
        keyword: "searchString",
        survey: "selectedSurveyTypes",
        satisfied: "selectedSatisfied",
        fresh: "selectedFreshIdea",
        page: "page",
        limit: "limit",
    };

    // avoid mutating queryParams, create a copy
    const mappedParams = Object.assign({}, queryParams);

    for (const [key, value] of Object.entries(map)) { // eslint-disable-line no-unused-vars
        if (mappedParams.hasOwnProperty(key)) {
            mappedParams[value] = mappedParams[key];
            delete mappedParams[key];
        }
    }

    return mappedParams;
};

/**
 * Function that takes in an array of strings: ["true","false"] and
 * returns an array of those strings as boolean: [true, false]
 * @param {Array} strArr
 */

const convertStringsArrayToBooleanArray = (selectedItemsStringArray) => {
    const selectedItemsArray = selectedItemsStringArray.join().split(",");
    return selectedItemsArray.map((ss) => {
        return (/true/i).test(ss);
    });
};

export const remapQueryParamsToLocalStateVariableNamesAndTypes = (queryParams) => {
    // this function renames query param names, the top-level keys, to the equivalent state variable names, the "name" properties
    // also casts the query param values to the given type
    const map = {
        start: { name: "dateStart", type: String },
        end: { name: "dateEnd", type: String },
        keyword: { name: "searchString", type: String },
        countries: { name: "selectedCountries", type: Array },
        settlements: { name: "selectedLocations", type: Array },
        types: { name: "selectedServiceTypes", type: Array },
        users: { name: "selectedUsers", type: Array },
        points: { name: "selectedServicePoints", type: Array },
        survey: { name: "selectedSurveyTypes", type: Array },
        satisfied: { name: "selectedSatisfied", type: Array },
        fresh: { name: "selectedFreshIdea", type: Array },
        page: { name: "page", type: Number },
        limit: { name: "limit", type: Number },
    };

    const mappedParams = { ...queryParams };

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(map)) {
        if (mappedParams.hasOwnProperty(key)) {
            if (Array.isArray(mappedParams[key])) {
                // getQueryParamsFromUrl always returns digit params as an array, but the 'ideasPage' and
                // 'ideasLimit' params are expected to be scalar values, so we convert them here
                mappedParams[value.name] = value.type(mappedParams[key][0]);
            }
            else {
                mappedParams[value.name] = value.type(mappedParams[key]);
            }
            if (key !== "page" && key !== "limit") {
                delete mappedParams[key];
            }
        }
    }

    if (mappedParams.selectedSurveyTypes) {
        const selectedItemsArray = mappedParams.selectedSurveyTypes.join().split(",");

        // returns the empty attribute: "" inside the selectedSurveyTypes array that is required in component state
        // when survey option is selected
        const arr = selectedItemsArray.map((ss) => {
            return ss;
        });

        mappedParams.selectedSurveyTypes = arr;
    }

    if (mappedParams.page) {
        const pageNumber = parseInt(mappedParams.page, 10);
        mappedParams.page = pageNumber;
    }

    if (mappedParams.selectedSatisfied) {
        const boolArr = convertStringsArrayToBooleanArray(mappedParams.selectedSatisfied);
        mappedParams.selectedSatisfied = boolArr;
    }

    if (mappedParams.selectedFreshIdea) {
        const boolArr = convertStringsArrayToBooleanArray(mappedParams.selectedFreshIdea);
        mappedParams.selectedFreshIdea = boolArr;
    }

    return mappedParams;
};

// returns a new object, which excludes any params that are not relevant to the global filter
// also "re-moment-ises" the date params
export const getGlobalFilterParams = (params) => {
    const globalFilterParamsKeys = [
        "selectedCountries",
        "selectedLocations",
        "selectedServicePoints",
        "selectedServiceTypes",
        "dateStart",
        "dateEnd",
        "searchString",
        "selectedSurveyTypes",
        "selectedFreshIdea",
        "selectedSatisfied",
        "selectedUsers",
        "page",
        "limit",
    ];

    let filteredParams = Object.fromEntries(
        Object.entries(params).filter(p => globalFilterParamsKeys.includes(p[0]))
    );

    if (filteredParams.hasOwnProperty("dateStart")) {
        filteredParams.dateStart = moment.utc(filteredParams.dateStart);
    }
    if (filteredParams.hasOwnProperty("dateEnd")) {
        filteredParams.dateEnd = moment.utc(filteredParams.dateEnd);
    }

    return filteredParams;
};

// returns a new object, which excludes any falsy values as well as empty arrays
export const getDefinedParams = (params) => {
    return Object.fromEntries(
        Object.entries(params).filter(p => p[1] && p[1].toString().length > 0)
    );
};
