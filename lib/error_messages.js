'use strict';

module.exports = {

  // Thrown when the user is attempting to map several
  // input files to a single destination
  mapping_cardinality: "You are attempting to compile a single output file " +
                       "from several input files.\nEither amend the src declaration," +
                       "or use a dynamic file mapping instead."

}