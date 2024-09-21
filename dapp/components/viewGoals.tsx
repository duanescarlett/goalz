import React from 'react';
import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from "wagmi";
import { ethers } from 'ethers';
import { GOALZ_ABI, getNetworkAddresses } from '../config/constants';
import GoalRow from './goalRow';
import { useSetGoal } from '../utils/ethereum';
import Link from 'next/link';

const ViewGoals = () => {

    const {address, chain} = useAccount();
    const [goalCount, setGoalCount] = useState(0);
    const setGoal = useSetGoal();

    const addresses = chain ? getNetworkAddresses(chain.id) : {};

    // ---
    // Get the goals that the user has created
    const userGoalzCount = useReadContract({
        address: addresses.GOALZ_ADDRESS,
        abi: GOALZ_ABI,
        functionName: 'balanceOf',
        args: [address],
    });

    useEffect(() => {
        if(userGoalzCount.data) {
            setGoalCount(ethers.BigNumber.from(userGoalzCount.data.toString()).toNumber());
        } else {
            setGoalCount(0);
        }
    }, [userGoalzCount.data]);

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12 mb-4 mb-md-0">
                    <div className="card border-dark">
                        <div className="card-header bg-secondary text-white">Your Goalz</div>
                        <div className="card-body">
                            {goalCount === 0 ? (
                                <div className="alert alert-info text-center">
                                    You have not created any goalz yet.<Link href="/create">Create one now</Link>
                                </div>
                            ) : (       
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>What</th>
                                                <th>Progress</th>
                                                <th></th>
                                                <th>Target Date</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.from(Array(goalCount).keys()).reverse().map((goalIndex) => (
                                                <GoalRow goalIndex={goalIndex} key={goalIndex} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewGoals;


