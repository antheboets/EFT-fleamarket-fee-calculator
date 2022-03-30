const TaxConstant = 0.09;
const LogTaxConstant = 0.05;



export function calFee(IntelCenterLvl = 0, Hideoutmanagement = 0, item,fleaPrice){
    /*
    VO × Ti × 4PO × Q + VR × Tr × 4PR × Q
    Where:
    VO is the total value of the offer, calculated by multiplying the base price of the item times the amount (base price × total item count / Q). The Base Price is a predetermined value for each item.
    VR is the total value of the requirements, calculated by adding the product of each requirement base price by their amount.
    PO is a modifier calculated as log10(VO / VR).
    If VR is less than VO then PO is also raised to the power of 1.08.
    PR is a modifier calculated as log10(VR / VO).
    If VR is greater or equal to VO then PR is also raised to the power of 1.08.
    Q is the "quantity" factor which is either 1 when "Require for all items in offer" is checked or the amount of items being offered otherwise.
    Ti and Tr are tax constants currently set to 0.05.
    30% of this commission will be deducted if the player has constructed the level 3 Intelligence Center.

    After this round the number, if it ends with a decimal point.
    */
    /*
    public virtual int GetFee(int IntelCenterLvl = 0, int Hideoutmanagement = 0)
    {
        //double comission = TrakovLib.GetFleaCommission(IntelCenterLvl, Hideoutmanagement);
        double comission = 1;
        double baseFee;
        if (FleaPrice >= BaseValue)
        {
            baseFee = (BaseValue * TrakovLib.TaxConstant * Math.Pow(4, Math.Log10(BaseValue / FleaPrice)) * Count) + (FleaPrice * TrakovLib.TaxConstant * Math.Pow(4, Math.Pow(Math.Log10(FleaPrice / BaseValue), TrakovLib.LogTaxConstant)) * Count);
        }
        else
        {
            baseFee = (BaseValue * TrakovLib.TaxConstant * Math.Pow(4, Math.Pow(Math.Log10(BaseValue / FleaPrice), TrakovLib.LogTaxConstant)) * Count) + (FleaPrice * TrakovLib.TaxConstant * Math.Pow(4, Math.Log10(FleaPrice / BaseValue)) * Count);
        }
        return (int)Math.Round(baseFee - ((baseFee * comission) / 100));
    }
    */
    const comission = 1;
    let baseFee;
    let Count = 0;
    if (fleaPrice >= item.BaseValue)
    {
        baseFee = (item.BaseValue * TaxConstant * Math.pow(4, Math.log10(item.BaseValue / fleaPrice)) * Count) + (fleaPrice * TaxConstant * Math.pow(4, Math.pow(Math.log10(fleaPrice / item.BaseValue), LogTaxConstant)) * Count);
    }
    else
    {
        baseFee = (item.BaseValue * TaxConstant * Math.pow(4, Math.pow(Math.log10(item.BaseValue / fleaPrice), LogTaxConstant)) * Count) + (fleaPrice * TaxConstant * Math.pow(4, Math.log10(fleaPrice / item.BaseValue)) * Count);
    }
    return Math.round(baseFee - ((baseFee * comission) / 100));
}

//calFee(0,0,{BaseValue:1},1)

export default calFee;