
export type SecurityRuleContext = {
    path: string;
    operation: 'get' | 'list' | 'create' | 'update' | 'delete';
    requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
    public context: SecurityRuleContext;

    constructor(context: SecurityRuleContext) {
        const message = `FirestoreError: Missing or insufficient permissions. The following request was denied by Firestore Security Rules:\n${JSON.stringify({
            operation: context.operation,
            path: context.path,
            requestData: context.requestResourceData,
        }, null, 2)}`;
        
        super(message);
        this.name = 'FirestorePermissionError';
        this.context = context;
        
        // This is to ensure the prototype chain is correct
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
