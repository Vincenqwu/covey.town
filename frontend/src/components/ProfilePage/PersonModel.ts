
/**
 * model
 */

export interface PersonModel {
  readonly username: string;
  readonly email: string;
  password: string;
}

/**
 * default values
 */

export const usePersonModelDefaults = (): PersonModel => ({
  username: "",
  email: "",
  password: ""
});

/**
 * constructor
 */

export function GetNewPersonModel(person: Partial<PersonModel> = {}) {
  return ({
    ...usePersonModelDefaults(),
    ...person
  });
}