export function adminQueryBuilder(requestParams){
    const pageNo = requestParams.pageNo;
    const pageSize = requestParams.pageSize;
    const pattern = requestParams?.pattern || ''; 
    const withImages = requestParams?.withImages || false;

    const queryObject = {
        orderBy:{
            productid:'asc',
        },
        include:{
            productimage:withImages,
        },
        skip:pageNo*(pageSize-1),
        take:pageSize,
    };

    if(pattern!=''){
        queryObject['orderBy']['productname'] = 'asc';
        queryObject['where']['productname']['startsWith'] = pattern;
    }

    return queryObject;
}

export function updateProductQueryBuilder(changedProduct){

    let queryObject = {
        'where':{
            'productid':changedProduct.productId
        },
        'data':{

        }
    };
    Object.keys(changedProduct['changes']).forEach(productField => {
        switch(productField){
            case 'produtctDescription':{
                queryObject.data['produtctdescription'] = changedProduct[productField];
                break;
            }
            case 'productName':{
                queryObject.data['productname'] = changedProduct[productField];
                break;
            }
            case 'quantity':{
                queryObject.data['quantity'] = {
                    'increment':changedProduct[productField]
                }
                break;
            }
            case 'price':{
                queryObject.data['price'] = changedProduct[productField];
                break;
            }
        }
    })
    return queryObject;
}