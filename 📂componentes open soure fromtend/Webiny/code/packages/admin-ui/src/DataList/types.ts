export type PaginationProp = {
    // Triggered when a page is about to be changed.
    setPage?: (page: number) => void;

    // Triggered when previous page is requested.
    setPreviousPage?: () => void;

    // Triggered when next page is requested.
    setNextPage?: () => void;

    // Triggered internally when in need to determine if there is a next page and apply UI changes accordingly.
    hasNextPage?: boolean;

    // Triggered internally when in need to determine if there is a previous page and apply UI changes accordingly.
    hasPreviousPage?: boolean;

    // Triggered when number of entries per page has been changed.
    setPerPage?: (amount: number) => void;

    // By default, users can choose from 10, 25 or 50 entries per page.
    perPageOptions?: number[];
};

export type SortersProp = Array<{ label: string; value: any }>;

export interface DataListProps<TData = any> {
    // Pass a function to take full control of list render.
    children?: ((props: any) => React.ReactNode) | null;

    // A title of paginated list.
    title?: React.ReactNode;

    // FormData that needs to be shown in the list.
    data?: TData | null;

    // A callback that must refresh current view by repeating the previous query.
    refresh?: (() => void) | null;

    // If true, Loader component will be shown, disallowing any interaction.
    loading?: boolean;

    // Provide a custom loader. Shown while the content is loading.
    loader?: React.ReactNode;

    // Provide a custom no data component. Shown while there is no data to be shown.
    noData?: React.ReactNode;

    // Provide all pagination data, options and callbacks here.
    pagination?: PaginationProp;

    // Triggered once a sorter has been selected.
    setSorters?: ((sorter: any) => void) | null;

    // Provide all sorters options and callbacks here.
    sorters?: SortersProp | null;

    // Provide actions that will be shown in the top right corner (eg. export or import actions).
    actions?: React.ReactNode;

    // Provide filters that will be shown in the top left corner (eg. filter by category or status).
    filters?: React.ReactNode;

    // Provide actions that can be executed on one or more multi-selected list items (eg. export or delete).
    multiSelectActions?: React.ReactNode;

    // Provide callback that will be executed once user selects all list items.
    multiSelectAll?: (value: boolean, data: Record<string, any>[] | null) => void;

    // Callback which returns true if all items were selected, otherwise returns false.
    isAllMultiSelected?: (data: Record<string, any>[] | null) => boolean;

    // Callback which returns true if none of the items were selected, otherwise returns false.
    isNoneMultiSelected?: (data: Record<string, any>[] | null) => boolean;

    showOptions?: {
        refresh?: boolean;
        pagination?: boolean;
        filters?: boolean;
        sorters?: boolean;
        [key: string]: any;
    };

    // Provide search UI that will be shown in the top left corner.
    search?: React.ReactElement;
    // Provide simple modal UI that will be shown over the list content.
    modalOverlay?: React.ReactElement;
    // Provide an action element that handle toggling the "Modal overlay".
    modalOverlayAction?: React.ReactElement;
    // Provide additional UI for list sub-header.
    subHeader?: React.ReactElement;

    meta?: Record<string, any> | null;

    setPage?: ((page: string) => void) | null;

    setPerPage?: ((page: string) => void) | null;

    perPageOptions?: number[];
}
