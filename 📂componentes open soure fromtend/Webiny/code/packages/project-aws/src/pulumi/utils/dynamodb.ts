export interface IDynamoDbConfigAttribute {
    name: string;
    type: "S";
}

export interface IDynamoDbConfigGlobalSecondaryIndex {
    name: string;
    hashKey: string;
    rangeKey: string;
    projectionType: "ALL";
}

export const createDynamoDbGSI = (indexes: string[]) => {
    return {
        withAttributes(original: IDynamoDbConfigAttribute[]): IDynamoDbConfigAttribute[] {
            return indexes.reduce<IDynamoDbConfigAttribute[]>((collection, name) => {
                collection.push(
                    {
                        name: `${name}_PK`,
                        type: "S"
                    },
                    {
                        name: `${name}_SK`,
                        type: "S"
                    }
                );

                return collection;
            }, original);
        },
        withGlobalSecondaryIndexes(
            original: IDynamoDbConfigGlobalSecondaryIndex[]
        ): IDynamoDbConfigGlobalSecondaryIndex[] {
            return indexes.reduce((collection, name) => {
                original.push({
                    name,
                    hashKey: `${name}_PK`,
                    rangeKey: `${name}_SK`,
                    projectionType: "ALL"
                });
                return collection;
            }, original);
        }
    };
};
