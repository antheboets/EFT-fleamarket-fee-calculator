const TaxConstantTi = 0.09;
const TaxConstantTr = 0.19;
const LogTaxConstant = 1.08;
const lvl3intelCenter = 30;
const hideoutmanagementboost = 1;

/*
    VO × Ti × 4PO × Q + VR × Tr × 4PR × Q
    basevalue x taxconstant x 4 pow(log10(basevalue/offerValue)) x count + offerValue x 
    Where:

    VO is the total value of the offer, calculated by multiplying the base price of the item times the amount (base price × total item count / Q).
    The Base Price is a predetermined value for each item.

    VR is the total value of the requirements, calculated by adding the product of each requirement base price by their amount.
    PO is a modifier calculated as log10(VO / VR).
    If VR is less than VO then PO is also raised to the power of 1.08.
    PR is a modifier calculated as log10(VR / VO).
    If VR is greater or equal to VO then PR is also raised to the power of 1.08.
    Q is the "quantity" factor which is either 1 when "Require for all items in offer" is checked or the amount of items being offered otherwise.
    Ti and Tr are tax constants; currently set to Ti = 0.09 and Tr = 0.19
    30% of this commission will be deducted if the player has constructed the level 3 Intelligence Center.
    This can be increased up to 45% with the Hideout management at level 50, each level giving 0.3% bonus.

    After this round the number, if it ends with a decimal point.
    The base price of any item can be calculated by dividing the trader buyback price with the multiplier of that trader.
    Traders have a different multiplier, Therapist=0.63, Ragman=0.62, Jaeger=0.6, Mechanic=0.56, Prapor=0.5,
    Peacekeeper~0.495, Skier=0.49, Fence=0.4. Durability of items or number of uses affects the base price,
     so in order to get the base price of full items, don't compare with damaged/used ones.
*/
export function calFee(intelCenterLvl = 0, hideoutmanagement = 0,count = 1, item,fleaPrice){
    let baseFee;
    if (fleaPrice >= item.BaseValue)
    {
        baseFee = (item.BaseValue * TaxConstantTi * Math.pow(4, Math.log10(item.BaseValue / fleaPrice)) * count) + (fleaPrice * TaxConstantTr * Math.pow(4, Math.pow(Math.log10(fleaPrice / item.BaseValue), LogTaxConstant)) * count);
    }
    else
    {
        baseFee = (item.BaseValue * TaxConstantTi * Math.pow(4, Math.pow(Math.log10(item.BaseValue / fleaPrice), LogTaxConstant)) * count) + (fleaPrice * TaxConstantTr * Math.pow(4, Math.log10(fleaPrice / item.BaseValue)) * count);
    }
    baseFee = Math.round(baseFee);
    if(intelCenterLvl >= 3){
        let feeDiscount = 100 - (lvl3intelCenter + (lvl3intelCenter / 100) * (hideoutmanagement * hideoutmanagementboost)); //change name
        return Math.round((baseFee / 100) * feeDiscount);
    }
    return baseFee;
}

export default calFee;