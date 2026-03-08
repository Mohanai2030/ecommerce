This is an e-commerce application.There were a few assumptions made when developing this application

Assumptions: 
      1. Unlike amazon,This isnt a marketplace where sellers also can list or store their items in amazon warehouses  
      2. Company buys the items or stock and stores them in their warehouses
      3. Two main types of users: Admin and Customer and one minimal role: Delivery partner

            Admin: responsible for updating the stock count whenever the company buys stock 
            Customer: places an order (mock payments - cash on delivery or pre-payment) and recieves the order by delivery 

            Delivery partner : no registration.login based on password.One account for each 3rd party company.All workers of a particular company will use the same login. 

            future version : 
                  registration of new 3rd party delivery partner 
                  seperate account for each employee in a specific partner company. 

                  3rd party companies may have their own apps.these apps will make request to amazon order_delivered api on behalf of their employee. 

      4. the company doesnt do last mile delivery on its own and instead it will partner with(a few) third party delivery partners for last mile delivery.
      5. Customers will always cooperate 


Core : 
      Auth 
      Product Search
      Cart - must persist even after logout 
      Order placement - 

What happens after an order is placed:
      stock level will be reduced by order_quantity in the db 

      packaged:
            (after a few minutes of order confirmation)
            - ready for shipping

      shipped :
            - company itself will ship it.
            (Assume: company doesnt use 3rd party partners for this)

      at Delivery Station:
            - once shipment has been done

      Assigned to delivery partner:
            - randomly assign a third party delivery partner.
            (future improvements : dont assign delivery partners randomly).

      out for delivery :
            - a third party delivery partner employee takes the parcel and starts the delivery route.

      delivered :
            -   3rd party delivery partner will reach the customer address and will give order to customer and send request to our initiate_order_delivery_status_change api.The order will be marked as ordered in our own interface. 

            future version:
                  - for high value orders , api will send OTP to customer 
                        "If delivery partner has reached your address and given your order ,tell this OTP to him ."
             

            there are a lot of edge cases in delivery confirmation 

      